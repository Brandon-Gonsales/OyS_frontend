import { Check, CopyAll } from '@mui/icons-material';
import React from 'react';
import ReactMarkdown from 'react-markdown';

export const MarkdownRenderer = ({ content, className = "" }) => {
  const [copiedCode, setCopiedCode] = React.useState(null);

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const CodeBlock = ({ children, className, node, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const code = String(children).replace(/\n$/, '');
    const codeId = Math.random().toString(36).substr(2, 9);

    return (
      <div className="relative group my-4">
        <div className="flex items-center justify-between bg-gray-800 text-gray-200 px-4 py-2 text-sm rounded-t-lg">
          <span className="font-medium">
            {language ? language.toUpperCase() : 'CODE'}
          </span>
          <button
            onClick={() => copyToClipboard(code, codeId)}
            className="flex items-center gap-1 px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 transition-colors opacity-0 group-hover:opacity-100"
          >
            {copiedCode === codeId ? (
              <>
                <Check size={14} />
                <span className="text-xs">Copiado</span>
              </>
            ) : (
              <>
                <CopyAll size={14} />
                <span className="text-xs">Copiar</span>
              </>
            )}
          </button>
        </div>
        <div className="bg-gray-900 rounded-b-lg overflow-hidden">
          <pre className="overflow-x-auto p-4 text-sm">
            <code className="text-gray-100">
              {code}
            </code>
          </pre>
        </div>
      </div>
    );
  };

  const InlineCode = ({ children }) => (
    <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">
      {children}
    </code>
  );

  const Table = ({ children }) => (
    <div className="my-4 overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          {children}
        </table>
      </div>
    </div>
  );

  const TableHeader = ({ children }) => (
    <thead className="bg-gray-50">
      {children}
    </thead>
  );

  const TableBody = ({ children }) => (
    <tbody className="bg-white divide-y divide-gray-200">
      {children}
    </tbody>
  );

  const TableRow = ({ children }) => (
    <tr className="hover:bg-gray-50">
      {children}
    </tr>
  );

  const TableCell = ({ children, isHeader }) => {
    const Component = isHeader ? 'th' : 'td';
    return (
      <Component className={`px-4 py-3 text-left ${
        isHeader 
          ? 'font-semibold text-gray-900 text-sm' 
          : 'text-gray-700 text-sm'
      }`}>
        {children}
      </Component>
    );
  };

  const components = {
    // Bloques de código
    code: ({ node, inline, className, children, ...props }) => {
      if (inline) {
        return <InlineCode {...props}>{children}</InlineCode>;
      }
      return <CodeBlock className={className} {...props}>{children}</CodeBlock>;
    },
    
    // Tablas
    table: Table,
    thead: TableHeader,
    tbody: TableBody,
    tr: TableRow,
    th: ({ children }) => <TableCell isHeader>{children}</TableCell>,
    td: ({ children }) => <TableCell>{children}</TableCell>,
    
    // Otros elementos
    h1: ({ children }) => (
      <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-6 first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl font-semibold text-gray-900 mb-3 mt-5">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-4">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-gray-700 mb-3 leading-relaxed">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-3 space-y-1 text-gray-700">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-3 space-y-1 text-gray-700">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="text-gray-700">
        {children}
      </li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-400 pl-4 py-2 my-4 bg-blue-50 text-gray-700 italic">
        {children}
      </blockquote>
    ),
    a: ({ children, href }) => (
      <a 
        href={href} 
        className="text-blue-600 hover:text-blue-800 underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-gray-900">
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className="italic text-gray-700">
        {children}
      </em>
    ),
    hr: () => (
      <hr className="border-gray-300 my-6" />
    ),
  };

  return (
    <div className={`prose-custom max-w-none ${className}`}>
      <ReactMarkdown components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
};
