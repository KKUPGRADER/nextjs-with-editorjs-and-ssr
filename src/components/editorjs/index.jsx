import { useEffect, useId, useRef } from "react";

import EditorJS from "@editorjs/editorjs";
import Undo from 'editorjs-undo';

import { EditorTools, i18n } from "./config";

// for more information about the types, you can visit the official website of editorjs
// type ArticleEditorProps = {
//   defaultValue: OutputData;
//   placeholder?: string;
//   readOnly?: boolean;
//   minHeight?: number;
//   onReady?: () => void;
//   onSave?: (data: OutputData) => void;
//   onChange?: (api: API, event: CustomEvent) => void;
// };

const ArticleEditor = ({
  defaultValue,
  placeholder,
  readOnly,
  minHeight,
  onReady,
  onChange,
  onSave,
}) => {
  const id = useId();
  // const editorJS = useRef<EditorJS | null>(null);
  const editorJS = useRef(null);
  // const [currentArticle, setCurrentArticle] = useState<OutputData | null>(null);

  useEffect(() => {
    if (editorJS.current === null) {
      editorJS.current = new EditorJS({
        placeholder,
        readOnly,
        minHeight,
        holder: id,
        data: defaultValue,
        i18n, // Can be null or undefined
        tools: EditorTools,
        // plugins: [
        //   Undo // Add the Undo plugin to the plugins array
        // ],
        onChange(api, event) {
          editorJS.current?.save().then((res ) => {
            // setCurrentArticle(res);
            console.log("saved data :", res);
            onSave && onSave(res);
          })

          onChange && onChange(api, event);
        },
        onReady() {
          new Undo({
            editor: editorJS.current,
            config: {
              debounceTimer: 150,
              maxLength: 100000000,
              shortcuts: {
                undo: "CMD+Z",
                redo: "CMD+SHIFT+Z"
              }
            }
          });
        },
      });
    }
  },[defaultValue]);
  return <div id={id} style={{
    width: '100%',
    height: '100%',
    border: '1px solid #ddd',
    padding: '10px',
    borderRadius: '5px',
    boxSizing: 'border-box',
    marginBlock: '10px',
  }}/>;
};

ArticleEditor.defaultProps = {
  placeholder: "Let's write an awesome story! ✨",
  readOnly: false,
  minHeight: 0,
};

export default ArticleEditor;