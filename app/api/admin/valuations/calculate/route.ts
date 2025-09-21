import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { externalValuationService, VehicleInfo } from '@/lib/external-apis';

// Import the same market search logic from the public API
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

interface ParsedCarValue {
  kbb_fair_value: string;
  edmunds_value: string;
  carmax_value: string;
  carvana_value: string;
  final_estimate: string;
  confidence: 'high' | 'medium' | 'low';
  explanation: string;
}

const supabaseUrl = 'https://xjiymlzvbvjzdujvgcwc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqaXltbHp2YnZqemR1anZnY3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzgyODksImV4cCI6MjA3MzkxNDI4OX0.Sxuqx6dsSGnUHcLXsffdIocjpEuBdxHtDkJNA7PKZB0';
const supabase = createClient(supabaseUrl, supabaseKey);

// Market data fetching functions (same as public API)
function isRelevantResult(result: SearchResult, year: string, make: string, model: string): boolean {
  const searchText = `${result.title} ${result.snippet}`.toLowerCase();
  const carDetails = `${year} ${make} ${model}`.toLowerCase();
  return searchText.includes(carDetails);
}

async function fetchMarketData(carInfo: { year: string; make: string; model: string; mileage: string }): Promise<MarketDataItem[]> {
  const serpApiKey = process.env.SERPAPI_KEY;
  if (!serpApiKey) {
    console.warn('SerpAPI key not configured for admin valuation');
    return [];
  }
  
  console.log('Admin valuation: Fetching real market data from SerpAPI');

  const marketDataPromises = SOURCES.map(async (source) => {
    const searchQuery = source.query
      .replace('{year}', carInfo.year.toString())
      .replace('{make}', carInfo.make)
      .replace('{model}', carInfo.model);

    console.log(`Admin valuation: Searching ${source.name}:`, searchQuery);

    try {
      const params = new URLSearchParams({
        engine: 'google',
        api_key: serpApiKey,
        q: searchQuery,
        hl: 'en',
        gl: 'us',
        num: '5',
      });
      
      const url = `https://serpapi.com/search.json?${params.toString()}`;
      const resp = await fetch(url);
      
      if (!resp.ok) {
        console.error(`Admin valuation: Failed to fetch from ${source.name}`);
        return null;
      }

      const data = await resp.json();
      const results = (data.organic_results || []) as SearchResult[];
      
      const relevantResults = results.filter(r => isRelevantResult(r, carInfo.year, carInfo.make, carInfo.model));
      
      if (relevantResults.length === 0) {
        console.log(`Admin valuation: No relevant results found for ${source.name}`);
        return null;
      }

      const combinedText = relevantResults
        .map(r => [r.title, r.snippet].filter(Boolean).join('\n'))
        .join('\n');

      return {
        source: source.name,
        text: combinedText
      };
    } catch (error) {
      console.error(`Admin valuation: Error fetching from ${source.name}:`, error);
      return null;
    }
  });

  const marketData = (await Promise.all(marketDataPromises)).filter((r): r is MarketDataItem => r !== null);
  console.log('Admin valuation: Collected market data from sources:', marketData.length);
  
  return marketData;
}

async function callOpenAIForAdmin(carInfo: { year: string; make: string; model: string; mileage: string }, marketData: MarketDataItem[]) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('OpenAI API key not configured for admin valuation');
    return null;
  }

  const marketDataText = marketData.map(d => `${d.source}:\n${d.text}`).join('\n\n');

  const fullPrompt = `Analyze the market data for a ${carInfo.year} ${carInfo.make} ${carInfo.model} with ${carInfo.mileage} miles and provide a structured response for admin valuation.

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
6. Provide detailed reasoning for admin review

Output Format (strict JSON):
{
  "kbb_fair_value": "$XX,XXX",
  "edmunds_value": "$XX,XXX",
  "carmax_value": "$XX,XXX",
  "carvana_value": "$XX,XXX",
  "final_estimate": "$XX,XXX",
  "confidence": "high|medium|low",
  "explanation": "Detailed explanation of the valuation for admin review"
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
        max_tokens: 400,
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Admin valuation: OpenAI API error:', errorText);
      return null;
    }

    const result = await response.json();
    console.log('Admin valuation: OpenAI response received');
    return result;
  } catch (error) {
    console.error('Admin valuation: OpenAI API error:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      vehicle_year,
      vehicle_make,
      vehicle_model,
      vehicle_mileage,
      vehicle_condition,
      vehicle_vin,
      base_value,
      market_data = {}
    } = body;

    if (!vehicle_year || !vehicle_make || !vehicle_model || !vehicle_mileage || !vehicle_condition) {
      return NextResponse.json(
        { error: 'Missing required vehicle parameters' },
        { status: 400 }
      );
    }

    // Get real market data using SerpAPI + OpenAI (same as public API)
    let realMarketData = null;
    let aiAnalysis = null;
    
    try {
      const carInfo = {
        year: vehicle_year.toString(),
        make: vehicle_make,
        model: vehicle_model,
        mileage: vehicle_mileage.toString()
      };
      
      console.log('Admin valuation: Fetching real market data for', carInfo);
      const marketData = await fetchMarketData(carInfo);
      
      if (marketData.length > 0) {
        console.log('Admin valuation: Using real market data from', marketData.length, 'sources');
        
        // Get AI analysis of real market data
        const aiResponse = await callOpenAIForAdmin(carInfo, marketData);
        if (aiResponse && aiResponse.choices && aiResponse.choices[0] && aiResponse.choices[0].message) {
          try {
            const content = aiResponse.choices[0].message.content.trim();
            console.log('Admin valuation: OpenAI response content:', content);
            
            aiAnalysis = JSON.parse(content);
            console.log('Admin valuation: AI analysis successful:', aiAnalysis);
            
            // Convert AI analysis to our format
            const kbbValue = parseInt(aiAnalysis.kbb_fair_value.replace(/[$,]/g, ''));
            const edmundsValue = parseInt(aiAnalysis.edmunds_value.replace(/[$,]/g, ''));
            const carmaxValue = parseInt(aiAnalysis.carmax_value.replace(/[$,]/g, ''));
            const carvanaValue = parseInt(aiAnalysis.carvana_value.replace(/[$,]/g, ''));
            const finalEstimate = parseInt(aiAnalysis.final_estimate.replace(/[$,]/g, ''));
            
            realMarketData = {
              kbb: kbbValue,
              edmunds: edmundsValue,
              carmax: carmaxValue,
              carvana: carvanaValue,
              average: finalEstimate,
              range: { 
                min: Math.min(kbbValue, edmundsValue, carmaxValue, carvanaValue),
                max: Math.max(kbbValue, edmundsValue, carmaxValue, carvanaValue)
              },
              confidence: aiAnalysis.confidence,
              explanation: aiAnalysis.explanation,
              sources: ['KBB', 'Edmunds', 'CarMax', 'Carvana']
            };
            
            console.log('Admin valuation: Real market data processed:', realMarketData);
          } catch (error) {
            console.error('Admin valuation: Failed to parse AI response:', error);
          }
        }
      } else {
        console.log('Admin valuation: No market data available, using fallback');
      }
    } catch (error) {
      console.error('Admin valuation: Error fetching real market data:', error);
    }

    // Fallback to old external API if real market data failed
    let externalMarketData = null;
    if (!realMarketData && vehicle_vin) {
      try {
        const vehicleInfo: VehicleInfo = {
          vin: vehicle_vin,
          year: vehicle_year,
          make: vehicle_make,
          model: vehicle_model,
          mileage: vehicle_mileage,
          condition: vehicle_condition,
          location: 'US',
        };
        
        externalMarketData = await externalValuationService.getMarketValuation(vehicleInfo);
        console.log('Admin valuation: Using fallback external market data:', externalMarketData);
      } catch (error) {
        console.error('Admin valuation: Error fetching fallback external market data:', error);
      }
    }

    // Get active valuation rules
    const { data: rules, error: rulesError } = await supabase
      .from('valuation_rules')
      .select('*')
      .eq('is_active', true)
      .order('priority');

    if (rulesError) {
      console.error('Error fetching valuation rules:', rulesError);
      return NextResponse.json(
        { error: 'Failed to fetch valuation rules' },
        { status: 500 }
      );
    }

    // Calculate base value if not provided
    let calculatedBaseValue = base_value || 0;
    if (!base_value) {
      // Use real market data if available (priority)
      if (realMarketData && realMarketData.average) {
        calculatedBaseValue = realMarketData.average;
        console.log('Admin valuation: Using real market data for base value:', calculatedBaseValue);
      } else if (externalMarketData && externalMarketData.average) {
        calculatedBaseValue = externalMarketData.average;
        console.log('Admin valuation: Using fallback external market data for base value:', calculatedBaseValue);
      } else {
        // Fallback to simple mock calculation based on year and make/model
        const currentYear = new Date().getFullYear();
        const age = currentYear - vehicle_year;
        
        // Base depreciation calculation
        let estimatedValue = 0;
        if (vehicle_make.toLowerCase().includes('honda') || vehicle_make.toLowerCase().includes('toyota')) {
          estimatedValue = 15000 - (age * 1000); // Reliable brands
        } else if (vehicle_make.toLowerCase().includes('bmw') || vehicle_make.toLowerCase().includes('mercedes')) {
          estimatedValue = 25000 - (age * 1500); // Luxury brands
        } else if (vehicle_make.toLowerCase().includes('ford') || vehicle_make.toLowerCase().includes('chevrolet')) {
          estimatedValue = 12000 - (age * 800); // Domestic brands
        } else {
          estimatedValue = 10000 - (age * 600); // Default
        }
        
        calculatedBaseValue = Math.max(1000, estimatedValue); // Minimum $1000
        console.log('Admin valuation: Using fallback calculation for base value:', calculatedBaseValue);
      }
    }

    // Calculate adjustments using rules
    let conditionAdjustment = 0;
    let mileageAdjustment = 0;
    const optionsAdjustment = 0;
    let marketAdjustment = 0;

    // Apply condition adjustments
    const conditionRules = rules?.filter(rule => rule.rule_type === 'condition') || [];
    for (const rule of conditionRules) {
      const config = rule.rule_config;
      if (config.condition === vehicle_condition) {
        conditionAdjustment = calculatedBaseValue * config.adjustment;
        break;
      }
    }

    // Apply mileage adjustments
    const mileageRules = rules?.filter(rule => rule.rule_type === 'mileage') || [];
    for (const rule of mileageRules) {
      const config = rule.rule_config;
      if (config.max_mileage && vehicle_mileage <= config.max_mileage) {
        mileageAdjustment = calculatedBaseValue * config.adjustment;
        break;
      } else if (config.min_mileage && vehicle_mileage >= config.min_mileage) {
        mileageAdjustment = calculatedBaseValue * config.adjustment;
        break;
      }
    }

    // Apply market adjustments
    const marketRules = rules?.filter(rule => rule.rule_type === 'market') || [];
    for (const rule of marketRules) {
      const config = rule.rule_config;
      // Simple seasonal adjustment based on current month
      const currentMonth = new Date().getMonth();
      if (config.spring && currentMonth >= 2 && currentMonth <= 4) {
        marketAdjustment = calculatedBaseValue * config.spring;
      } else if (config.summer && currentMonth >= 5 && currentMonth <= 7) {
        marketAdjustment = calculatedBaseValue * config.summer;
      } else if (config.fall && currentMonth >= 8 && currentMonth <= 10) {
        marketAdjustment = calculatedBaseValue * config.fall;
      } else if (config.winter && currentMonth === 11 || currentMonth <= 1) {
        marketAdjustment = calculatedBaseValue * config.winter;
      }
    }

    // Calculate totals
    const totalAdjustments = conditionAdjustment + mileageAdjustment + optionsAdjustment + marketAdjustment;
    const adjustedValue = Math.max(0, calculatedBaseValue + totalAdjustments);

    // Get fee rules
    const feeRules = rules?.filter(rule => rule.rule_type === 'fees') || [];
    let inspectionFee = 150;
    let processingFee = 200;

    for (const rule of feeRules) {
      const config = rule.rule_config;
      if (rule.rule_name === 'inspection_fee') {
        inspectionFee = config.amount || 150;
      } else if (rule.rule_name === 'processing_fee') {
        processingFee = config.amount || 200;
      }
    }

    const totalFees = inspectionFee + processingFee;
    const netOfferMin = Math.max(0, adjustedValue - totalFees - (adjustedValue * 0.1));
    const netOfferMax = Math.max(0, adjustedValue - totalFees + (adjustedValue * 0.1));
    const recommendedOffer = Math.max(0, adjustedValue - totalFees);

    // Generate justification
    const justification = generateJustification({
      vehicle_year,
      vehicle_make,
      vehicle_model,
      vehicle_mileage,
      vehicle_condition,
      calculatedBaseValue,
      conditionAdjustment,
      mileageAdjustment,
      optionsAdjustment,
      marketAdjustment,
      totalAdjustments,
      adjustedValue,
      inspectionFee,
      processingFee,
      recommendedOffer
    });

    // Enhanced justification with real market data
    let enhancedJustification = justification;
    if (realMarketData) {
      enhancedJustification += `\n\nReal Market Data Analysis:\n`;
      enhancedJustification += `KBB Value: $${realMarketData.kbb.toLocaleString()}\n`;
      enhancedJustification += `Edmunds Value: $${realMarketData.edmunds.toLocaleString()}\n`;
      enhancedJustification += `CarMax Value: $${realMarketData.carmax.toLocaleString()}\n`;
      enhancedJustification += `Carvana Value: $${realMarketData.carvana.toLocaleString()}\n`;
      enhancedJustification += `Market Average: $${realMarketData.average.toLocaleString()}\n`;
      enhancedJustification += `Confidence Level: ${realMarketData.confidence}\n`;
      enhancedJustification += `AI Analysis: ${realMarketData.explanation}`;
    }

    return NextResponse.json({
      data: {
        base_value: calculatedBaseValue,
        condition_adjustment: conditionAdjustment,
        mileage_adjustment: mileageAdjustment,
        options_adjustment: optionsAdjustment,
        market_adjustment: marketAdjustment,
        total_adjustments: totalAdjustments,
        adjusted_value: adjustedValue,
        inspection_fee: inspectionFee,
        processing_fee: processingFee,
        total_fees: totalFees,
        net_offer_min: netOfferMin,
        net_offer_max: netOfferMax,
        recommended_offer: recommendedOffer,
        justification_rationale: enhancedJustification,
        // Real market data (priority)
        real_market_data: realMarketData,
        // Fallback external market data
        external_market_data: externalMarketData,
        data_sources: realMarketData ? realMarketData.sources : (externalMarketData ? Object.keys(externalMarketData).filter(key => key !== 'average' && key !== 'range') : []),
        // AI analysis details
        ai_analysis: aiAnalysis
      }
    });
  } catch (error) {
    console.error('Error in valuation calculation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateJustification(params: Record<string, unknown>): string {
  const {
    vehicle_year,
    vehicle_make,
    vehicle_model,
    vehicle_mileage,
    vehicle_condition,
    calculatedBaseValue,
    conditionAdjustment,
    mileageAdjustment,
    marketAdjustment,
    totalAdjustments,
    adjustedValue,
    inspectionFee,
    processingFee,
    recommendedOffer
  } = params;

  let justification = `Valuation for ${vehicle_year} ${vehicle_make} ${vehicle_model}:\n\n`;
  
  justification += `Base Market Value: $${calculatedBaseValue.toLocaleString()}\n`;
  
  if (conditionAdjustment !== 0) {
    const conditionPercent = ((conditionAdjustment / calculatedBaseValue) * 100).toFixed(1);
    justification += `Condition Adjustment (${vehicle_condition}): ${conditionAdjustment >= 0 ? '+' : ''}$${conditionAdjustment.toLocaleString()} (${conditionPercent}%)\n`;
  }
  
  if (mileageAdjustment !== 0) {
    const mileagePercent = ((mileageAdjustment / calculatedBaseValue) * 100).toFixed(1);
    justification += `Mileage Adjustment (${vehicle_mileage.toLocaleString()} miles): ${mileageAdjustment >= 0 ? '+' : ''}$${mileageAdjustment.toLocaleString()} (${mileagePercent}%)\n`;
  }
  
  if (marketAdjustment !== 0) {
    const marketPercent = ((marketAdjustment / calculatedBaseValue) * 100).toFixed(1);
    justification += `Market Adjustment: ${marketAdjustment >= 0 ? '+' : ''}$${marketAdjustment.toLocaleString()} (${marketPercent}%)\n`;
  }
  
  justification += `\nTotal Adjustments: ${totalAdjustments >= 0 ? '+' : ''}$${totalAdjustments.toLocaleString()}\n`;
  justification += `Adjusted Value: $${adjustedValue.toLocaleString()}\n`;
  justification += `Fees (Inspection: $${inspectionFee}, Processing: $${processingFee}): $${(inspectionFee + processingFee).toLocaleString()}\n`;
  justification += `\nRecommended Offer: $${recommendedOffer.toLocaleString()}`;

  return justification;
}
