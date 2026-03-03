import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Letter } from "../backend.d";
import { useActor } from "./useActor";

export function useGetLetters() {
  const { actor, isFetching } = useActor();
  return useQuery<Letter[]>({
    queryKey: ["letters"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLetters();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetLetter(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Letter | null>({
    queryKey: ["letter", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getLetter(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useCreateLetter() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      to,
      from,
      title,
      body,
      bouquet,
      theme,
    }: {
      to: string;
      from: string;
      title: string;
      body: string;
      bouquet: string;
      theme: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createLetter(to, from, title, body, bouquet, theme);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["letters"] });
    },
  });
}

export function useDeleteLetter() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteLetter(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["letters"] });
    },
  });
}
