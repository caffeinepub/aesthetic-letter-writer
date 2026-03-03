import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Letter {
    id: bigint;
    to: string;
    theme: string;
    title: string;
    body: string;
    from: string;
    createdAt: bigint;
    bouquet: string;
}
export interface backendInterface {
    createLetter(to: string, from: string, title: string, body: string, bouquet: string, theme: string): Promise<bigint>;
    deleteLetter(id: bigint): Promise<void>;
    getLetter(id: bigint): Promise<Letter | null>;
    getLetters(): Promise<Array<Letter>>;
}
