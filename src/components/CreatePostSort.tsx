
'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface PostSortItem {
  id: string;
  content: string;
  type: 'text' | 'image' | 'video';
}

export function CreatePostSort() {
  const [items, setItems] = useState<PostSortItem[]>([
    { id: '1', content: 'First text block', type: 'text' },
    { id: '2', content: 'https://example.com/image.jpg', type: 'image' },
    { id: '3', content: 'Another text block', type: 'text' },
  ]);

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    setItems(newItems);
  };

  const addTextBlock = () => {
    const newItem: PostSortItem = {
      id: Date.now().toString(),
      content: 'New text block',
      type: 'text'
    };
    setItems([...items, newItem]);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create & Organize Post</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 bg-background hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {item.type === 'text' && (
                    <textarea
                      value={item.content}
                      onChange={(e) => {
                        const newItems = [...items];
                        newItems[index].content = e.target.value;
                        setItems(newItems);
                      }}
                      className="w-full border rounded px-3 py-2 resize-none"
                      rows={3}
                    />
                  )}
                  {item.type === 'image' && (
                    <div className="text-sm text-muted-foreground">
                      📷 Image: {item.content}
                    </div>
                  )}
                  {item.type === 'video' && (
                    <div className="text-sm text-muted-foreground">
                      🎥 Video: {item.content}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 ml-4">
                  <button
                    onClick={() => index > 0 && moveItem(index, index - 1)}
                    disabled={index === 0}
                    className="px-2 py-1 text-xs border rounded disabled:opacity-50"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => index < items.length - 1 && moveItem(index, index + 1)}
                    disabled={index === items.length - 1}
                    className="px-2 py-1 text-xs border rounded disabled:opacity-50"
                  >
                    ↓
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Button onClick={addTextBlock} mode="subtle">
            Add Text Block
          </Button>
          <Button mode="subtle">
            Add Image
          </Button>
          <Button mode="subtle">
            Add Video
          </Button>
        </div>
        
        <Button className="w-full">
          Publish Post
        </Button>
      </CardContent>
    </Card>
  );
}
