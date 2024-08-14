import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  // Allow user to set text via URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const textParam = urlParams.get('text');

  const [tokenCount, setTokenCount] = useState(0);

  const textareaRef = useRef(null);

  const worker = useRef(null);

  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(new URL('./worker.js', import.meta.url), {
        type: 'module'
      });
    }

    const onMessageReceived = (e) => {
      setTokenCount(e.data.token_ids.length);
    };

    worker.current.addEventListener('message', onMessageReceived);

    // Load Claude tokenizer on startup
    worker.current.postMessage({ model_id: 'Xenova/claude-tokenizer', text: '' });

    return () => worker.current.removeEventListener('message', onMessageReceived);
  }, []);

  const onInputChange = useCallback((e) => {
    const text = e.target.value;
    worker.current.postMessage({ model_id: 'Xenova/claude-tokenizer', text });
  }, []);

  useEffect(() => {
    if (textParam) {
      onInputChange({ target: { value: textParam } });
    }
  }, [onInputChange, textParam]);

  return (
    <div className='w-full max-w-[720px] flex flex-col gap-4 items-center'>

      <div>
        <h1 className='text-5xl font-bold mb-2'>The Tokenizer Playground</h1>
        <h2 className='text-lg font-normal'>Experiment with the Claude tokenizer (running <a className="text-gray-900 underline" href="https://github.com/xenova/transformers.js">locally</a> in your browser).</h2>
      </div>

     <textarea
        ref={textareaRef}
        onChange={onInputChange}
        rows="8"
        className="font-mono text-lg block w-full p-2.5 text-gray-900 bg-gray-50 rounded-lg border border-gray-200
                   scrollbar-hide whitespace-pre-wrap" // Add whitespace-pre-wrap
        placeholder="Enter some text"
        defaultValue={textParam ?? textareaRef.current?.value ?? ''}
      ></textarea>

      <div className='flex justify-center gap-5'>
        <div className='flex flex-col'>
          <h2 className='font-semibold uppercase leading-4'>Tokens</h2>
          <h3 className='font-semibold text-3xl'>{tokenCount.toLocaleString()}</h3>
        </div>
        <div className='flex flex-col'>
          <h2 className='font-semibold uppercase leading-4'>Characters</h2>
          <h3 className='font-semibold text-3xl'>{(textareaRef.current?.value.length ?? 0).toLocaleString()}</h3>
        </div>
      </div>

    </div >
  )
}

export default App
