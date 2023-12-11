import { ensureDirSync } from '../includes/deps.ts';

// deno-lint-ignore-file no-explicit-any
export function getUserInput(sentence: string): string {
  let input = null;

  do {
    input = prompt(sentence);
  } while (!input);
  return input.toLocaleLowerCase();
}

export function writeJson(data: any): void {
  try {
    Deno.writeTextFileSync('./data/data.json', JSON.stringify(data));
  } catch (e) {
    return e.message;
  }
}

export function createDirectoryIfNotExist(subreddit: string) {
  ensureDirSync(`./media/${subreddit}/images`);
  ensureDirSync(`./media/${subreddit}/videos`);
}
