import { NextRequest, NextResponse } from 'next/server';

interface SearchResult {
  title: string;
  snippet: string;
  source: string;
  text: string;
}

const SOURCES = [
  { 
    name: 'Kelley Blue Book',
    query: 'site:kbb.com "{year} {make} {model}" value',
    sourceType: 'pricing'
  },
  { 
    name: 'Edmunds',
    query: 'site:edmunds.com "{year} {make} {model}" value',
    sourceType: 'pricing'
  },
  { 
    name: 'CarMax',
    query: 'site:carmax.com "{year} {make} {model}"',
    sourceType: 'dealer'
  },
  { 
    name: 'Carvana',
    query: 'site:carvana.com "{year} {make} {model}" value',
    sourceType: 'dealer'
  }
];

type MarketDataItem = SearchResult;

interface CarValueResponse {
  estimatedPrice: string;
  kbb_fair_value: string;
  edmunds_value: string;
  carmax_value: string;
  carvana_value: string;
  confidence: string;
  explanation: string;
  marketData: {
    estimatedPrice: number;
    kbb_fair_value: number;
    edmunds_value: number;
    carmax_value: number;
    carvana_value: number;
    average: number;
    range: { min: number; max: number };
  };
}

interface CarInfo {
  year: string;
  make: string;
  model: string;
  mileage: string;
  vin?: string;
  condition?: 'excellent' | 'good' | 'fair' | 'poor';
}

interface ParsedCarValue {
  kbb_fair_value: string;
  edmunds_value: string;
  carmax_value: string;
  carvana_value: string;
  final_estimate: string;
  confidence: 'high' | 'medium' | 'low';
  explanation: string;
}

function isRelevantResult(result: SearchResult, year: string, make: string, model: string): boolean {
  const searchText = `${result.title} ${result.snippet}`.toLowerCase();
  const carDetails = `${year} ${make} ${model}`.toLowerCase();
  
  // Check if the result contains all parts of the car details
  return searchText.includes(carDetails);
}

async function fetchMarketData(carInfo: CarInfo): Promise<MarketDataItem[]> {
  const serpApiKey = process.env.SERPAPI_KEY;
  if (!serpApiKey) {
    console.error('SerpAPI key not configured');
    return [];
  }
  
  console.log('SerpAPI key found, proceeding with real market data search');

  // Fetch market data in parallel
  const marketDataPromises = SOURCES.map(async (source) => {
    // Replace all placeholders in the query
    const searchQuery = source.query
      .replace('{year}', carInfo.year.toString())
      .replace('{make}', carInfo.make)
      .replace('{model}', carInfo.model)
      .replace('{mileage}', carInfo.mileage.toString());

    console.log(`Searching ${source.name}:`, searchQuery);

    try {
      const params = new URLSearchParams({
        engine: 'google',
        api_key: serpApiKey,
        q: searchQuery,
        hl: 'en',
        gl: 'us',
        num: '5', // Get top 5 results for better matching
      });
      
      const url = `https://serpapi.com/search.json?${params.toString()}`;
      const resp = await fetch(url);
      
      if (!resp.ok) {
        const errorText = await resp.text();
        console.error(`Failed to fetch from ${source.name}:`, errorText);
        return null;
      }

      const data = await resp.json();
      console.log(`${source.name} response received`);

      const results = (data.organic_results || []) as SearchResult[];
      
      // Filter results to only include relevant matches
      const relevantResults = results.filter(r => isRelevantResult(r, carInfo.year, carInfo.make, carInfo.model));
      
      if (relevantResults.length === 0) {
        console.log(`No relevant results found for ${source.name}`);
        return null;
      }

      // Combine snippets from relevant results
      const combinedText = relevantResults
        .map(r => [r.title, r.snippet].filter(Boolean).join('\n'))
        .join('\n');

      console.log(`${source.name} processed text:`, combinedText);

      return {
        source: source.name,
        text: combinedText
      };
    } catch (error) {
      console.error(`Error fetching from ${source.name}:`, error);
      return null;
    }
  });

  const marketData = (await Promise.all(marketDataPromises)).filter((r): r is MarketDataItem => r !== null);
  console.log('Collected market data from sources:', marketData.length);
  
  return marketData;
}

async function callOpenAI(carInfo: CarInfo, marketData: MarketDataItem[]) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OpenAI API key not configured');
    return null;
  }

  const marketDataText = marketData.map(d => `${d.source}:\n${d.text}`).join('\n\n');

  const fullPrompt = `Analyze the market data for a ${carInfo.year} ${carInfo.make} ${carInfo.model} with ${carInfo.mileage} miles and provide a structured response.

Market Data:
${marketDataText}

Instructions:
1. Calculate the estimated market value based on:
   - KBB values
   - Edmunds values
   - CarMax listings
   - Carvana listings
2. Weight listings (Edmunds, KBB) more heavily than dealer listings
3. Consider trim level and features if mentioned
4. For newer vehicles (2020+), be more conservative with estimates
5. For older vehicles (pre-2010), consider condition and mileage more heavily

Output Format (strict JSON):
{
  "kbb_fair_value": "$XX,XXX",
  "edmunds_value": "$XX,XXX",
  "carmax_value": "$XX,XXX",
  "carvana_value": "$XX,XXX",
  "final_estimate": "$XX,XXX",
  "confidence": "high|medium|low",
  "explanation": "Brief explanation of the valuation"
}

Return ONLY the JSON object with exact fields as shown above. No additional text or formatting.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: fullPrompt }],
        temperature: 0.1,
        max_tokens: 300,
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      return null;
    }

    const result = await response.json();
    console.log('OpenAI response:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return null;
  }
}


async function getCarValue(carInfo: CarInfo): Promise<CarValueResponse> {
  console.log('Processing car info:', { 
    year: carInfo.year, 
    mileage: carInfo.mileage, 
    make: carInfo.make, 
    model: carInfo.model, 
    vin: carInfo.vin 
  });
  
  // Try to get real market data first
  const marketData = await fetchMarketData(carInfo);
  let parsedContent: ParsedCarValue | null = null;
  
  if (marketData.length > 0) {
    console.log('Using real market data from', marketData.length, 'sources');
    
    // Try to get AI analysis of real market data
    const aiResponse = await callOpenAI(carInfo, marketData);
    if (aiResponse && aiResponse.choices && aiResponse.choices[0] && aiResponse.choices[0].message) {
      try {
        const content = aiResponse.choices[0].message.content.trim();
        console.log('OpenAI response content:', content);
        
        // Try to parse the JSON content
        parsedContent = JSON.parse(content);
        console.log('AI analysis successful, parsed content:', parsedContent);
      } catch (error) {
        console.error('Failed to parse AI response:', error);
        console.log('Raw AI response:', JSON.stringify(aiResponse, null, 2));
      }
    } else {
      console.log('No valid AI response received');
    }
  } else {
    console.log('No market data available');
    throw new Error('Unable to retrieve market data for this vehicle. Please try again later.');
  }
  
  // If AI analysis failed, return error
  if (!parsedContent) {
    console.log('AI analysis failed');
    throw new Error('Unable to analyze market data for this vehicle. Please try again later.');
  }
  
  // Use AI analysis results
  const kbbValue = parseInt(parsedContent.kbb_fair_value.replace(/[$,]/g, ''));
  const edmundsValue = parseInt(parsedContent.edmunds_value.replace(/[$,]/g, ''));
  const carmaxValue = parseInt(parsedContent.carmax_value.replace(/[$,]/g, ''));
  const carvanaValue = parseInt(parsedContent.carvana_value.replace(/[$,]/g, ''));
  const finalEstimate = parseInt(parsedContent.final_estimate.replace(/[$,]/g, ''));
  
  const values = [kbbValue, edmundsValue, carmaxValue, carvanaValue];
  const average = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  const min = Math.min(...values);
  const max = Math.max(...values);
  
  return {
    estimatedPrice: parsedContent.final_estimate,
    kbb_fair_value: parsedContent.kbb_fair_value,
    edmunds_value: parsedContent.edmunds_value,
    carmax_value: parsedContent.carmax_value,
    carvana_value: parsedContent.carvana_value,
    confidence: parsedContent.confidence,
    explanation: `Based on real-time market analysis from multiple sources for a ${carInfo.year} ${carInfo.make} ${carInfo.model} with ${carInfo.mileage} miles. This estimate considers current market conditions, vehicle specifications, and comparable sales data.\n\n${parsedContent.explanation}`,
    marketData: {
      estimatedPrice: finalEstimate,
      kbb_fair_value: kbbValue,
      edmunds_value: edmundsValue,
      carmax_value: carmaxValue,
      carvana_value: carvanaValue,
      average,
      range: { min, max }
    }
  };
}

export async function POST(req: NextRequest) {
  try {
    const { year, make, model, mileage, vin, condition } = await req.json();
    console.log('Received request:', { year, make, model, mileage, vin, condition });
    
    if (!year || !make || !model || !mileage) {
      console.log('Missing required fields:', { year, make, model, mileage });
      return NextResponse.json(
        { error: 'Missing required fields (year, make, model, mileage)' },
        { status: 400 }
      );
    }

    const carInfo: CarInfo = {
      year,
      make,
      model,
      mileage,
      vin,
      condition: condition || 'good'
    };

    const carValue = await getCarValue(carInfo);
      console.log('Final car value:', carValue);

      return NextResponse.json(carValue);
    
  } catch (error) {
    console.error('Market search error:', error);
    return NextResponse.json(
      { error: 'Failed to estimate car value' },
      { status: 500 }
    );
  }
}