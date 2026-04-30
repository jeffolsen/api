import clsx from "clsx";
import {
  AtomicFormComponentProps,
  ChildFromFormProps,
} from "@/components/inputs/Input";
import { Controller } from "react-hook-form";
import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import { Mark, mergeAttributes, JSONContent, Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import FieldSetWrapperWithMinMax from "../partials/FieldSetWrapper";
import Button from "../common/Button";
import { useEffect } from "react";

export type RichTextProps = Omit<
  AtomicFormComponentProps & ChildFromFormProps,
  "rules" | "componentName"
>;

export const RichTextInput = (props: RichTextProps) => {
  const { displayName, dataName, description, control, watch } = props;
  const watchedValue = watch(dataName);
  console.log(props);

  return (
    <FieldSetWrapperWithMinMax
      displayName={displayName}
      description={description}
    >
      <Controller
        name={dataName}
        control={control}
        render={({ field: { value, onChange } }) => (
          <ControlledTiptap value={value} onChange={onChange} />
        )}
      />

      <details className="w-full">
        <summary>json</summary>
        <pre className="!bg-neutral !text-neutral-content p-4">
          <code className=" w-full p-4 max-w-full whitespace-break-spaces">
            {JSON.stringify(watchedValue, null, 2)}
          </code>
        </pre>
      </details>
    </FieldSetWrapperWithMinMax>
  );
};

export function ControlledTiptap({
  value,
  onChange,
}: {
  value: JSONContent;
  onChange: (e: JSONContent) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        blockquote: false,
        codeBlock: false,
        heading: false,
        horizontalRule: false,
        link: false,
        strike: false,
        code: false,
      }),
      PseudoHeading,
    ],
    content: value, // Set initial JSON data

    // CRITICAL: Push changes to React Hook Form on every keystroke
    onUpdate({ editor }) {
      onChange(editor.getJSON());
    },
  });

  useEffect(() => {
    if (!editor || !value) return;

    // 1. Compare stringified values to avoid cursor-jumping loops
    const currentJSON = JSON.stringify(editor.getJSON());
    const incomingJSON = JSON.stringify(value);

    if (currentJSON !== incomingJSON) {
      // 2. Safely apply content without triggering recursive update events
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  return (
    <div className="flex flex-col gap-3 w-full">
      <ToolBar editor={editor} />
      <EditorContent
        editor={editor}
        className={clsx([
          "textarea border-gray-400/50 w-full flex-grow",
          "pl-6 bg-base-300",
          "prose prose-sm max-w-full",
        ])}
      />
    </div>
  );
}

function ToolBar({ editor }: { editor: Editor }) {
  const activeStates = useEditorState({
    editor,
    selector: (ctx) => {
      // 1. Defend against execution before the editor is mounted
      if (!ctx.editor)
        return {
          isBold: false,
          isItalic: false,
          isBulletList: false,
          isOrderedList: false,
          isFakeH3: false,
        };

      return {
        isBold: ctx.editor.isActive("bold"),
        isItalic: ctx.editor.isActive("italic"),
        isBulletList: ctx.editor.isActive("bulletList"),
        isOrderedList: ctx.editor.isActive("orderedList"),
        isFakeH3: ctx.editor.isActive("pseudoHeading"),
      };
    },
  });

  const buttons = [
    {
      label: "title",
      active: activeStates.isFakeH3,
      // 2. Fixed the lowercase 'c' in onClick
      onClick: () => editor.chain().focus().togglePseudoHeading().run(),
    },
    {
      label: "bold",
      active: activeStates.isBold,
      onClick: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: "italic",
      active: activeStates.isItalic,
      onClick: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: "bullet",
      active: activeStates.isBulletList,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: "ordered",
      active: activeStates.isOrderedList,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
    },
  ];

  return (
    <div className="flex gap-1">
      {buttons.map((b) => (
        <Button
          key={b.label} // 3. Added key to prevent React warnings
          color={b.active ? "primary" : "secondary"}
          onClick={b.onClick}
          size="sm"
        >
          {b.label}
        </Button>
      ))}
    </div>
  );
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    pseudoHeading: {
      /**
       * Toggles a simulated heading (span with a large font size class)
       */
      togglePseudoHeading: () => ReturnType;
    };
  }
}

export const PseudoHeading = Mark.create({
  name: "pseudoHeading",

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, { class: "fake-h3-style" }),
      0,
    ];
  },

  addCommands() {
    return {
      togglePseudoHeading:
        () =>
        ({ commands }) => {
          return commands.toggleMark(this.name);
        },
    };
  },
});

// const CustomListItem = ListItem.extend({
//   // Allows plain text OR bullet lists OR ordered lists inside the <li>
//   content: '(text | bulletList | orderedList)*',
// })

export default RichTextInput;
