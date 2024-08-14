import { env, AutoTokenizer } from '@xenova/transformers'

// Wrap everything in an async IIFE
(async () => {
  env.allowLocalModels = false;

  const tokenizer = await AutoTokenizer.from_pretrained('Xenova/claude-tokenizer');

  self.addEventListener('message', async (event) => {
      const text = event.data.text;

      const start = performance.now();
      const token_ids = tokenizer.encode(text);
      const end = performance.now();
      console.log('[INFO]', `Tokenized ${text.length} characters in ${(end - start).toFixed(2)}ms`)

      self.postMessage({ token_ids });
  });
})();
