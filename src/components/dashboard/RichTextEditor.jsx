import { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import LinkIcon from '@mui/icons-material/Link'
import LinkOffIcon from '@mui/icons-material/LinkOff'
import FormatColorTextIcon from '@mui/icons-material/FormatColorText'
import FormatColorResetIcon from '@mui/icons-material/FormatColorReset'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'

// The site's own accent palette (src/scss/_variables.scss) plus the two extra brand
// colors the original hardcoded Hero bio highlighted words with — same 5 colors, so
// re-seeding/matching that exact design is a swatch click, not a hex-code lookup.
const HIGHLIGHT_COLORS = [
  { name: 'Cyan', value: '#00d4ff' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Green', value: '#10b981' },
  { name: 'Orange', value: '#f97316' },
  { name: 'React blue', value: '#61DAFB' },
  { name: 'Pink', value: '#ff6b6b' },
]

function ToolbarButton({ active, onClick, disabled, title, children }) {
  return (
    <IconButton
      type="button"
      size="small"
      // Clicking a toolbar button would otherwise steal focus from the editor first,
      // collapsing/losing the text selection the command is supposed to act on —
      // preventing the mousedown's default keeps focus (and the selection) in place.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      title={title}
      sx={{
        color: active ? 'var(--accent)' : 'var(--text-secondary)',
        background: active ? 'rgba(0, 212, 255, 0.12)' : 'transparent',
        borderRadius: '6px',
        padding: '4px',
        '&:hover': { background: 'rgba(255,255,255,0.06)' },
        '&.Mui-disabled': { color: 'var(--muted)', opacity: 0.4 },
      }}
    >
      {children}
    </IconButton>
  )
}

// Free, MIT-licensed rich text editor — Tiptap core + StarterKit (bold/italic/strike/
// lists/blockquote/undo-redo) + Underline + Link + Placeholder + TextStyle/Color (text
// highlight colors). Every extension used here ships in Tiptap's free tier forever;
// nothing Pro-only (collab, AI, etc.) is involved. Controlled like a plain <textarea>:
// `value` is an HTML string, `onChange` fires with the new HTML on every edit —
// drop-in replacement for the multiline TextFields it replaces in ProjectFormModal.jsx
// / ContentPresetFormModal.jsx / HeroPanel.jsx.
export default function RichTextEditor({ value, onChange, placeholder = 'Type here…', minHeight = 90 }) {
  const [colorMenuAnchor, setColorMenuAnchor] = useState(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' } }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    onUpdate: ({ editor: ed }) => onChange(ed.getHTML()),
    editorProps: {
      attributes: { class: 'rte-content' },
    },
  })

  // Controlled-component sync: when `value` changes from OUTSIDE this editor instance
  // (an "insert/add from library" preset appended text externally, or the parent form
  // reset when switching between editingItem and a blank New form) push it into the
  // editor without re-emitting onUpdate (the trailing `false`) — otherwise every
  // external update would loop straight back through onChange and fight the editor's
  // own cursor position on every keystroke.
  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    const incoming = value || ''
    const isEffectivelyEmpty = incoming === '' && current === '<p></p>'
    if (incoming !== current && !isEffectivelyEmpty) {
      editor.commands.setContent(incoming, false)
    }
  }, [value, editor])

  if (!editor) return null

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('Link URL', previousUrl || 'https://')
    if (url === null) return // cancelled
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="dash-rte">
      <div className="dash-rte__toolbar">
        <ToolbarButton active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">
          <FormatBoldIcon fontSize="small" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
          <FormatItalicIcon fontSize="small" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline">
          <FormatUnderlinedIcon fontSize="small" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough">
          <StrikethroughSIcon fontSize="small" />
        </ToolbarButton>
        <span className="dash-rte__divider" />
        <ToolbarButton
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet list"
        >
          <FormatListBulletedIcon fontSize="small" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered list"
        >
          <FormatListNumberedIcon fontSize="small" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Quote"
        >
          <FormatQuoteIcon fontSize="small" />
        </ToolbarButton>
        <span className="dash-rte__divider" />
        <ToolbarButton active={editor.isActive('link')} onClick={setLink} title="Add / edit link">
          <LinkIcon fontSize="small" />
        </ToolbarButton>
        <ToolbarButton
          disabled={!editor.isActive('link')}
          onClick={() => editor.chain().focus().extendMarkRange('link').unsetLink().run()}
          title="Remove link"
        >
          <LinkOffIcon fontSize="small" />
        </ToolbarButton>
        <span className="dash-rte__divider" />
        <ToolbarButton
          active={editor.isActive('textStyle', { color: /.+/ })}
          onClick={(e) => setColorMenuAnchor(e.currentTarget)}
          title="Highlight color"
        >
          <FormatColorTextIcon
            fontSize="small"
            className="dash-rte__color-icon"
            style={{ '--rte-cursor-color': editor.getAttributes('textStyle').color || undefined }}
          />
        </ToolbarButton>
        <Menu
          anchorEl={colorMenuAnchor}
          open={Boolean(colorMenuAnchor)}
          onClose={() => setColorMenuAnchor(null)}
          slotProps={{
            paper: {
              sx: {
                background: 'rgba(20, 20, 28, 0.98)',
                border: '1px solid var(--border)',
                borderRadius: 2,
                padding: '8px',
              },
            },
          }}
        >
          <div className="dash-rte-color-menu">
            {HIGHLIGHT_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                title={c.name}
                onClick={() => {
                  editor.chain().focus().setColor(c.value).run()
                  setColorMenuAnchor(null)
                }}
                className="dash-rte-swatch"
                style={{ '--swatch-color': c.value }}
              />
            ))}
            <button
              type="button"
              title="Clear color"
              onClick={() => {
                editor.chain().focus().unsetColor().run()
                setColorMenuAnchor(null)
              }}
              className="dash-rte-swatch dash-rte-swatch--clear"
            >
              <FormatColorResetIcon sx={{ fontSize: 14 }} />
            </button>
          </div>
        </Menu>
        <span className="dash-rte__spacer" />
        <ToolbarButton disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()} title="Undo">
          <UndoIcon fontSize="small" />
        </ToolbarButton>
        <ToolbarButton disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()} title="Redo">
          <RedoIcon fontSize="small" />
        </ToolbarButton>
      </div>
      <div className="dash-rte__content" style={{ '--rte-min-height': `${minHeight}px` }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
