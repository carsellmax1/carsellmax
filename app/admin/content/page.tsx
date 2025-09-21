"use client";

import { AdminLayout } from "@/components/layouts/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Plus,
  FileText,
  Globe,
  EyeOff,
  CheckCircle,
  ArrowUpDown
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface ContentBlock {
  id: string;
  page_slug: string;
  block_type: string;
  content_data: Record<string, unknown>;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export default function ContentPage() {
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageFilter, setPageFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const pageOptions = [
    { value: "all", label: "All Pages" },
    { value: "homepage", label: "Homepage" },
    { value: "how-it-works", label: "How It Works" },
    { value: "instant-quote", label: "Instant Quote" },
    { value: "about", label: "About" },
    { value: "contact", label: "Contact" }
  ];

  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "hero", label: "Hero" },
    { value: "section", label: "Section" },
    { value: "text", label: "Text" },
    { value: "faq", label: "FAQ" },
    { value: "cta", label: "Call to Action" },
    { value: "seo", label: "SEO" }
  ];

  const getTypeBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case 'hero':
        return <Badge variant="default">Hero</Badge>;
      case 'section':
        return <Badge variant="secondary">Section</Badge>;
      case 'text':
        return <Badge variant="outline">Text</Badge>;
      case 'faq':
        return <Badge variant="outline">FAQ</Badge>;
      case 'cta':
        return <Badge variant="default" className="bg-blue-600">CTA</Badge>;
      case 'seo':
        return <Badge variant="outline">SEO</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getPageIcon = (pageSlug: string) => {
    switch (pageSlug) {
      case 'homepage':
        return <Globe className="h-4 w-4" />;
      case 'how-it-works':
        return <FileText className="h-4 w-4" />;
      case 'instant-quote':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const fetchContentBlocks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/content');
      const data = await response.json();
      
      if (data.error) {
        console.error("Error fetching content blocks:", data.error);
        return;
      }

      setContentBlocks(data.data || []);
    } catch (error) {
      console.error("Error fetching content blocks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContentBlocks();
  }, []);

  const filteredBlocks = contentBlocks.filter(block => {
    const matchesSearch = 
      block.page_slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      block.block_type?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPage = pageFilter === "all" || block.page_slug === pageFilter;
    const matchesType = typeFilter === "all" || block.block_type === typeFilter;
    
    return matchesSearch && matchesPage && matchesType;
  });

  const handleTogglePublish = async (blockId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/content/${blockId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_published: !currentStatus
        })
      });
      
      if (response.ok) {
        // Refresh the content blocks
        fetchContentBlocks();
      } else {
        alert('Failed to update content block');
      }
    } catch (error) {
      console.error('Error updating content block:', error);
      alert('Error updating content block');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Content Management</h1>
            <p className="text-muted-foreground">
              Manage website content and page blocks
            </p>
          </div>
          <div className="flex space-x-2">
            <Link href="/admin/content/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Content Block
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by page or block type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <select
                  value={pageFilter}
                  onChange={(e) => setPageFilter(e.target.value)}
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  {pageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  {typeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Blocks Table */}
        <Card>
          <CardHeader>
            <CardTitle>Content Blocks ({filteredBlocks.length})</CardTitle>
            <CardDescription>
              Manage website content and page blocks
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page</TableHead>
                    <TableHead>Block Type</TableHead>
                    <TableHead>Content Preview</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBlocks.map((block) => (
                    <TableRow key={block.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getPageIcon(block.page_slug)}
                          <span className="font-medium">{block.page_slug}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getTypeBadge(block.block_type)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground max-w-xs truncate">
                          {String(block.content_data?.title || block.content_data?.subtitle || 'No preview available')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <ArrowUpDown className="h-3 w-3" />
                          <span>{block.sort_order}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {block.is_published ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-sm">
                            {block.is_published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(block.updated_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Link href={`/admin/content/${block.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleTogglePublish(block.id, block.is_published)}
                          >
                            {block.is_published ? (
                              <>
                                <EyeOff className="h-4 w-4 mr-1" />
                                Unpublish
                              </>
                            ) : (
                              <>
                                <Globe className="h-4 w-4 mr-1" />
                                Publish
                              </>
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
