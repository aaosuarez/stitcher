import dmcColors from "./dmc.json";

export type ThreadColor = {
  id: string;
  name: string;
  hex: string;
};

const colors: ThreadColor[] = dmcColors;

class DMCThreadColors {
  threads: ThreadColor[] = [];

  constructor() {
    this.threads = colors;
  }

  getThreadById(threadId: string) {
    return this.threads.find((thread) => thread.id === threadId);
  }
}

export const threadColors = new DMCThreadColors();
