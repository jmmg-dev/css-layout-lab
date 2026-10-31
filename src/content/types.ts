/** Rewrites a single CSS declaration inside a rule when an option is picked. */
export type PropertyControl = {
  kind: 'property';
  labelKey: string;
  selector: string;
  property: string;
  options: string[];
};

/** Swaps the whole snippet, for options that change more than one declaration. */
export type PresetControl = {
  kind: 'preset';
  labelKey: string;
  options: { value: string; html: string; css: string }[];
};

export type Control = PropertyControl | PresetControl;

export type Example = {
  html: string;
  css: string;
  /** Initial preview height in px. Reserves space to avoid layout shift. */
  height: number;
  /** Starting value of the width control, as a percentage. Defaults to 100. */
  initialWidth?: number;
  controls?: Control[];
};

export type Section = { ns: string; items: number };

export type GroupId = 'fundamentals' | 'flex' | 'grid' | 'beyond';

export type PageView = 'topic' | 'overview' | 'introduction' | 'blockInline' | 'flexVsGrid';

export type DocPage = {
  path: string;
  group: GroupId;
  ns: string;
  view: PageView;
  items?: number;
  sections?: Section[];
  example?: string;
};
