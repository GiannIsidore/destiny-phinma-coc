import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Save,
  Eye,
  EyeOff,
  Bold,
  Italic,
  List,
  Link,
  Heading,
  Quote,
} from "lucide-react";
import { API_URL } from "../lib/config";

interface ContentItem {
  id: number;
  content_type: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const AdminContent = () => {
  const [contents, setContents] = useState<Record<string, ContentItem>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<Record<string, boolean>>({});
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Markdown helper functions
  const insertMarkdown = (
    type: string,
    text: string,
    prefix: string,
    suffix: string = "",
  ) => {
    const textarea = document.getElementById(
      `content-${type}`,
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);
    const beforeText = text.substring(0, start);
    const afterText = text.substring(end);

    let newText;
    if (selectedText) {
      newText = beforeText + prefix + selectedText + suffix + afterText;
    } else {
      newText = beforeText + prefix + suffix + afterText;
    }

    updateContent(type, "content", newText);

    // Set cursor position
    setTimeout(() => {
      const newCursorPos = selectedText
        ? start + prefix.length + selectedText.length + suffix.length
        : start + prefix.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  const markdownButtons = [
    { icon: Heading, label: "Heading", prefix: "## ", suffix: "" },
    { icon: Bold, label: "Bold", prefix: "**", suffix: "**" },
    { icon: Italic, label: "Italic", prefix: "*", suffix: "*" },
    { icon: List, label: "List", prefix: "- ", suffix: "" },
    { icon: Quote, label: "Quote", prefix: "> ", suffix: "" },
    { icon: Link, label: "Link", prefix: "[", suffix: "](url)" },
  ];

  const contentTypes = [
    {
      key: "mission",
      label: "Mission",
      description: "Library mission statement",
    },
    { key: "vision", label: "Vision", description: "Library vision statement" },
    {
      key: "goals",
      label: "Goals",
      description: "Library goals and objectives",
    },
    {
      key: "library_policies",
      label: "Library Policies",
      description: "Complete library policies and rules",
    },
  ];

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const response = await fetch(`${API_URL}/content.php`);
      const data = await response.json();

      if (data.status === "success") {
        const contentMap: Record<string, ContentItem> = {};
        data.data.forEach((item: ContentItem) => {
          contentMap[item.content_type] = item;
        });
        setContents(contentMap);
      }
    } catch (error) {
      console.error("Error fetching contents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (type: string) => {
    const content = contents[type];
    if (!content) return;

    setSaving(type);
    setSuccess("");
    setError("");
    try {
      const response = await fetch(`${API_URL}/content.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: type,
          title: content.title,
          content: content.content,
        }),
      });

      const data = await response.json();
      if (data.status === "success") {
        setSuccess("Content saved successfully.");
        fetchContents();
      } else {
        setError(data.message || "Failed to save content.");
      }
    } catch (error) {
      setError("Error saving content.");
    } finally {
      setSaving(null);
    }
  };

  const updateContent = (type: string, field: string, value: string) => {
    setContents((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
        content_type: type,
        id: prev[type]?.id || 0,
        created_at: prev[type]?.created_at || "",
        updated_at: prev[type]?.updated_at || "",
      },
    }));
  };

  const togglePreview = (type: string) => {
    setPreviewMode((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const renderMarkdown = (text: string) => {
    return text
      .replace(
        /^### (.*$)/gim,
        '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>',
      )
      .replace(
        /^## (.*$)/gim,
        '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>',
      )
      .replace(
        /^# (.*$)/gim,
        '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>',
      )
      .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*)\*/gim, "<em>$1</em>")
      .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(
        /^> (.*$)/gim,
        '<blockquote class="border-l-4 border-gray-300 pl-4 italic">$1</blockquote>',
      )
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/gim,
        '<a href="$2" class="text-blue-600 underline">$1</a>',
      )
      .replace(/\n/gim, "<br>");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">
            Content Management
          </h1>
        </div>
        <p className="text-gray-600 mt-2">
          Manage mission, vision, goals, and library policies
        </p>
        {success && <div className="text-green-600 mt-4">{success}</div>}
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </div>

      <Tabs defaultValue="mission" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          {contentTypes.map((type) => (
            <TabsTrigger key={type.key} value={type.key}>
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {contentTypes.map((type) => (
          <TabsContent key={type.key} value={type.key}>
            <Card className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{type.label}</h2>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePreview(type.key)}
                    >
                      {previewMode[type.key] ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                      {previewMode[type.key] ? "Edit" : "Preview"}
                    </Button>
                    <Button
                      onClick={() => handleSave(type.key)}
                      disabled={saving === type.key}
                      size="sm"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saving === type.key ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>

                {!previewMode[type.key] ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`title-${type.key}`}>Title</Label>
                      <Input
                        id={`title-${type.key}`}
                        value={contents[type.key]?.title || ""}
                        onChange={(e) =>
                          updateContent(type.key, "title", e.target.value)
                        }
                        placeholder="Enter title"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`content-${type.key}`}>
                        Content
                        {(type.key === "library_policies" ||
                          type.key === "goals") && (
                          <span className="text-sm text-blue-600 ml-2">
                            (Markdown supported - use the buttons below for
                            formatting)
                          </span>
                        )}
                      </Label>

                      {/* Markdown Toolbar */}
                      {(type.key === "library_policies" ||
                        type.key === "goals") && (
                        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-200 rounded-t-md">
                          <div className="text-xs text-gray-600 w-full mb-2">
                            Formatting Tools:
                          </div>
                          {markdownButtons.map((button, index) => (
                            <Button
                              key={index}
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8 px-2"
                              onClick={() =>
                                insertMarkdown(
                                  type.key,
                                  contents[type.key]?.content || "",
                                  button.prefix,
                                  button.suffix,
                                )
                              }
                              title={button.label}
                            >
                              <button.icon className="w-3 h-3" />
                            </Button>
                          ))}
                          <div className="text-xs text-gray-500 w-full mt-2">
                            Tips: Select text first, then click a button to
                            format it. For lists, place cursor at start of line.
                          </div>
                        </div>
                      )}

                      <Textarea
                        id={`content-${type.key}`}
                        value={contents[type.key]?.content || ""}
                        onChange={(e) =>
                          updateContent(type.key, "content", e.target.value)
                        }
                        placeholder={
                          type.key === "goals"
                            ? "Enter library goals (use - for bullet points, ## for headings)"
                            : type.key === "library_policies"
                              ? "Enter library policies (Markdown formatting supported)"
                              : "Enter content"
                        }
                        rows={
                          type.key === "library_policies"
                            ? 20
                            : type.key === "goals"
                              ? 12
                              : 6
                        }
                        className={`font-mono text-sm ${
                          type.key === "library_policies" ||
                          type.key === "goals"
                            ? "rounded-t-none border-t-0"
                            : ""
                        }`}
                      />
                    </div>

                    {contents[type.key]?.updated_at && (
                      <p className="text-sm text-gray-500">
                        Last updated:{" "}
                        {new Date(
                          contents[type.key].updated_at,
                        ).toLocaleString()}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <h3 className="text-lg font-semibold mb-3">
                        {contents[type.key]?.title}
                      </h3>
                      {type.key === "library_policies" ||
                      type.key === "goals" ? (
                        <div
                          className="prose max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: renderMarkdown(
                              contents[type.key]?.content || "",
                            ),
                          }}
                        />
                      ) : (
                        <p className="text-gray-700 leading-relaxed">
                          {contents[type.key]?.content}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AdminContent;
