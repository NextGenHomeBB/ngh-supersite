'use client'

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import { useCallback, useEffect, useRef, useState } from 'react'
import { uploadImage } from '../../lib/adminClient'

// Polished WYSIWYG for Lucy, built on TipTap. Emits clean semantic HTML
// (h2/h3, p, ul/ol, blockquote, a, strong/em, img) that maps 1:1 onto the
// site's .ngh-article styling. Server-side sanitize is the final gate.

type Props = {
  value: string
  onChange: (html: string) => void
  articleId: string
}

function ToolbarButton({
  onClick, active, disabled, title, children,
}: {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`h-9 min-w-9 px-2.5 rounded-md text-sm flex items-center justify-center border transition-colors ${
        active
          ? 'bg-[#C6A96C]/20 border-[#C6A96C]/50 text-[#C6A96C]'
          : 'bg-transparent border-white/10 text-[#D4D0C8] hover:border-[#C6A96C]/40 hover:text-[#F5F3EE]'
      } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  )
}

function Toolbar({ editor, articleId }: { editor: Editor; articleId: string }) {
  const [linkOpen, setLinkOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const openLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined
    setLinkUrl(prev || '')
    setLinkOpen(true)
  }
  const applyLink = () => {
    let url = linkUrl.trim()
    if (!url) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      if (!/^(https?:|mailto:|tel:|\/|#)/i.test(url)) url = `https://${url}`
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
    setLinkOpen(false)
  }

  const pickImage = () => fileRef.current?.click()
  const onFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      e.target.value = ''
      if (!file) return
      setUploading(true)
      try {
        const url = await uploadImage(file, articleId)
        const alt = window.prompt('Image description (for accessibility & SEO):', '') || ''
        editor.chain().focus().setImage({ src: url, alt }).run()
      } catch (err) {
        alert('Image upload failed. Please try again.')
        console.error(err)
      } finally {
        setUploading(false)
      }
    },
    [editor, articleId],
  )

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 rounded-t-xl border border-white/10 bg-black/20 sticky top-0 z-10">
      <ToolbarButton title="Normal text" active={editor.isActive('paragraph')} onClick={() => editor.chain().focus().setParagraph().run()}>¶</ToolbarButton>
      <ToolbarButton title="Heading" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</ToolbarButton>
      <ToolbarButton title="Subheading" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</ToolbarButton>
      <span className="w-px h-6 bg-white/10 mx-1" />
      <ToolbarButton title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></ToolbarButton>
      <ToolbarButton title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></ToolbarButton>
      <ToolbarButton title="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></ToolbarButton>
      <span className="w-px h-6 bg-white/10 mx-1" />
      <ToolbarButton title="Bulleted list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>•</ToolbarButton>
      <ToolbarButton title="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1.</ToolbarButton>
      <ToolbarButton title="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>&ldquo;</ToolbarButton>
      <span className="w-px h-6 bg-white/10 mx-1" />
      <ToolbarButton title="Link" active={editor.isActive('link')} onClick={openLink}>🔗</ToolbarButton>
      <ToolbarButton title="Image" disabled={uploading} onClick={pickImage}>{uploading ? '…' : '🖼'}</ToolbarButton>
      <ToolbarButton title="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}>―</ToolbarButton>
      <span className="w-px h-6 bg-white/10 mx-1" />
      <ToolbarButton title="Clear formatting" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>⌫</ToolbarButton>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />

      {linkOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setLinkOpen(false)}>
          <div className="bg-[#262626] border border-white/10 rounded-xl p-5 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <p className="text-sm text-[#F5F3EE] mb-3">Add or edit link</p>
            <input
              autoFocus
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') applyLink() }}
              placeholder="https://example.com  (leave empty to remove)"
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-[#F5F3EE] outline-none focus:border-[#C6A96C]"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => setLinkOpen(false)} className="px-3 py-2 rounded-lg text-sm text-[#8A8F83] hover:text-[#F5F3EE]">Cancel</button>
              <button type="button" onClick={applyLink} className="px-4 py-2 rounded-lg text-sm bg-[#C6A96C] text-[#1F1F1F] hover:opacity-90">Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function RichEditor({ value, onChange, articleId }: Props) {
  const editor = useEditor({
    immediatelyRender: false, // required for Next SSR/static export
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: false,
        underline: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' },
      }),
      Image.configure({ inline: false, HTMLAttributes: { class: '' } }),
      Placeholder.configure({ placeholder: 'Start writing your article…' }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'ngh-article ngh-editor-body min-h-[440px] px-6 py-6 outline-none',
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  // Sync external value changes (e.g. loading a different article) into the editor.
  const lastSet = useRef(value)
  useEffect(() => {
    if (editor && value !== lastSet.current && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', { emitUpdate: false })
      lastSet.current = value
    }
  }, [value, editor])

  if (!editor) {
    return <div className="min-h-[440px] rounded-xl border border-white/10 bg-black/20" />
  }

  return (
    <div className="rounded-xl border border-white/10 bg-[#1F1F1F] overflow-hidden">
      <Toolbar editor={editor} articleId={articleId} />
      <EditorContent editor={editor} />
    </div>
  )
}
