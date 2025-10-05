'use client';

import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

import { commands } from '@uiw/react-md-editor';

type TextState = {
  selectedText: string;
};

type TextApi = {
  replaceSelection: (text: string) => void;
};

interface MarkdownEditorProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
}

// SSR 禁用
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const customCommands = [
    {
      name: 'title1',
      keyCommand: 'title1',
      buttonProps: { 'aria-label': '大標' },
      icon: <span style={{ padding: '0 6px', fontSize: '20px' }}>大標</span>,
      execute: (state: TextState, api: TextApi) => {
        api.replaceSelection(`# ${state.selectedText || '大標題內容'}`);
      },
    },
    {
      name: 'title2',
      keyCommand: 'title2',
      buttonProps: { 'aria-label': '中標' },
      icon: <span style={{ padding: '0 6px', fontSize: '16px' }}>中標</span>,
      execute: (state: TextState, api: TextApi) => {
        api.replaceSelection(`## ${state.selectedText || '中標題內容'}`);
      },
    },
    {
      name: 'title3',
      keyCommand: 'title3',
      buttonProps: { 'aria-label': '小標' },
      icon: <span style={{ padding: '0 6px', fontSize: '12px' }}>小標</span>,
      execute: (state: TextState, api: TextApi) => {
        api.replaceSelection(`### ${state.selectedText || '小標題內容'}`);
      },
    },
    commands.bold,
    commands.italic,
    commands.strikethrough,
    commands.code,
    commands.codeBlock,
    commands.quote,
    commands.link,
    commands.image,
    commands.unorderedListCommand,
    commands.orderedListCommand,
    commands.checkedListCommand,
    commands.hr,
  ];
  
  return (
    <div data-color-mode="light">
      <MDEditor
        value={value}
        onChange={onChange}
        height={500}
        preview="edit"
        commands={customCommands}
      />
    </div>
  );
}
