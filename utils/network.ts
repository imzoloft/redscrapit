import { Destination, download, writeAllSync } from '../includes/deps.ts';
import { variables } from '../includes/globals.ts';

// Setup User-Agent for the request atleast.
const headers = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/110.0',
};

export async function downloadFromURL(
  url: string,
  destination: Destination,
  options?: RequestInit | undefined
) {
  try {
    await download(url, destination, { headers: headers, ...options });
    Deno.stdout.write(
      new TextEncoder().encode(`successed: ${++variables.failed}\r`)
    );
  } catch (e) {
    console.log('error: ', e.message);
    Deno.stdout.write(
      new TextEncoder().encode(`failed: ${++variables.failed}\n`)
    );
  }
}
