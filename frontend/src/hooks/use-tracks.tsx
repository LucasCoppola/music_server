import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useClient } from "./use-client";
import { BASE_URL, queryKeys } from "@/lib/consts";

export type Track = {
  id: string;
  title: string;
  artist: string;
  user_id: string;
  track_name: string;
  favorite: boolean;
  image_name: string | null;
  duration: number;
  bit_rate: number;
  created_at: Date;
};

type UploadTrack = {
  message: string;
  track_name: string;
  mimetype: string;
  size_in_kb: number;
};

export function useTracks(query: string) {
  const client = useClient<Track[]>();

  return useQuery({
    queryKey: queryKeys.tracks(),
    queryFn: () =>
      client(`${BASE_URL}/api/tracks?q=${query}`, { method: "GET" }),
  });
}

export function useUploadTrackFile() {
  const client = useClient<UploadTrack>();

  return useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      const formData = new FormData();
      formData.append("track", file);

      return await client(`${BASE_URL}/api/tracks/upload/audio`, {
        method: "POST",
        body: formData,
      });
    },
    onError: (e) => {
      console.error("Failed to upload track", e);
    },
  });
}

export function useUploadTrackCoverImage() {
  const queryClient = useQueryClient();
  const client = useClient<{ message: string; image_name: string }>();

  return useMutation({
    mutationFn: async ({ file, trackId }: { file: File; trackId: string }) => {
      const formData = new FormData();
      formData.append("image", file);

      return await client(`${BASE_URL}/api/tracks/${trackId}/upload/image`, {
        method: "POST",
        body: formData,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tracks() });
      toast.success(data.message || "Track cover image uploaded successfully.");
    },
    onError: (e) => {
      console.error("Failed to upload cover image", e);
      toast.error(e.message || "Failed to upload cover image");
    },
  });
}

export function useCreateTrack() {
  const queryClient = useQueryClient();
  const client = useClient<{ message: string }>();

  return useMutation({
    mutationFn: async ({
      title,
      artist,
      track_name,
      mimetype,
      size_in_kb,
    }: {
      title: string;
      artist: string;
      track_name: string;
      mimetype: string;
      size_in_kb: number;
    }) => {
      return await client(`${BASE_URL}/api/tracks`, {
        method: "POST",
        headers: { contentType: "application/json" },
        body: { title, artist, track_name, mimetype, size_in_kb },
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tracks() });
      toast.success(data.message || "Track created successfully.");
    },
    onError: (e) => {
      console.error("Failed to create track", e);
      toast.error(e.message || "Failed to create track");
    },
  });
}

export function useDeleteTrack() {
  const queryClient = useQueryClient();
  const client = useClient<{ message: string }>();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      return await client(`${BASE_URL}/api/tracks/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tracks() });
      toast.success(data.message || "Track deleted successfully.");
    },
    onError: (e) => {
      console.error("Failed to delete track", e);
      toast.error(e.message || "Failed to delete track");
    },
  });
}
