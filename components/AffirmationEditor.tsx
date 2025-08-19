'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import { 
  Bold, Italic, List, ListOrdered, Heading2, 
  Quote, Minus, Undo, Redo 
} from 'lucide-react';

interface AffirmationEditorProps {
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
  placeholder?: string;
}

export default function AffirmationEditor({ 
  content, 
  onChange, 
  editable = true,
  placeholder = 'Write your powerful affirmations here...'
}: AffirmationEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3]
        }
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
      Typography
    ],
    content,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-xl max-w-none focus:outline-none min-h-[600px] p-6',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full">
      {editable && (
        <div className="border-b border-gray-200 p-2 flex items-center gap-1 flex-wrap">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''
            }`}
            type="button"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('bold') ? 'bg-gray-200' : ''
            }`}
            type="button"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('italic') ? 'bg-gray-200' : ''
            }`}
            type="button"
          >
            <Italic className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('bulletList') ? 'bg-gray-200' : ''
            }`}
            type="button"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('orderedList') ? 'bg-gray-200' : ''
            }`}
            type="button"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive('blockquote') ? 'bg-gray-200' : ''
            }`}
            type="button"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="p-2 rounded hover:bg-gray-100"
            type="button"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
            type="button"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
            type="button"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
      )}
      <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden ${
        editable ? 'hover:border-gray-300' : ''
      } transition-colors`}>
        <EditorContent editor={editor} />
      </div>
      <style jsx global>{`
        .ProseMirror {
          min-height: 600px;
          color: #000000;
          font-size: 1.25rem;
          line-height: 1.8;
        }
        .ProseMirror:focus {
          outline: none;
        }
        .ProseMirror h2 {
          font-size: 1.75rem;
          font-weight: 900;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #000000;
        }
        .ProseMirror h3 {
          font-size: 1.5rem;
          font-weight: 800;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #000000;
        }
        .ProseMirror p {
          margin-bottom: 1rem;
          font-size: 1.25rem;
          color: #000000;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #000000;
          padding-left: 1rem;
          font-style: italic;
          margin: 1rem 0;
          color: #000000;
          font-weight: 600;
        }
        .ProseMirror hr {
          margin: 1.5rem 0;
          border-color: #000000;
        }
        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5rem;
          margin: 1rem 0;
        }
        .ProseMirror li {
          margin: 0.5rem 0;
          font-size: 1.25rem;
          color: #000000;
        }
        .ProseMirror strong {
          font-weight: 900;
          color: #000000;
        }
        .ProseMirror em {
          font-style: italic;
          font-weight: 600;
          color: #000000;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: #9ca3af;
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}