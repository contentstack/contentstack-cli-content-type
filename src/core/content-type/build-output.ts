export type BuildOutput = {
    header: string | null;
    body: string;
    footer: string | null;
    rows: string[][];
    hasResults: boolean;
}
