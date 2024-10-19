import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useClient } from "./use-client";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Track } from "./use-tracks";
import { BASE_URL, queryKeys } from "@/lib/consts";

export type Playlist = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  type: "regular" | "favorite";
  image_name: string;
  track_count: number;
  duration: number;
  tracks: Track[];
};

export function usePlaylists() {
  const client = useClient<Playlist[]>();
  return useQuery({
    queryKey: queryKeys.playlists(),
    queryFn: () => client(`${BASE_URL}/api/playlists`, { method: "GET" }),
  });
}

export function usePlaylistById(playlistId: string) {
  const client = useClient<Playlist>();
  return useQuery({
    queryKey: queryKeys.playlist(playlistId),
    queryFn: () =>
      client(`${BASE_URL}/api/playlists/${playlistId}`, {
        method: "GET",
      }),
    enabled: !!playlistId,
  });
}

export function useCreatePlaylist() {
  const client = useClient<{ message: string }>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      client(`${BASE_URL}/api/playlists`, {
        method: "POST",
        headers: { contentType: "application/json" },
        body: { id, title, type: "regular" },
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.playlists() });
      toast.success(data.message || "Playlist created successfully.");
    },
    onError: (e) => {
      console.error("Failed to create playlist", e);
      toast.error(e.message || "Failed to create playlist");
    },
  });
}

export function useUpdatePlaylistTitle() {
  const client = useClient<{ message: string; playlistId: string }>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      client(`${BASE_URL}/api/playlists/${id}`, {
        method: "PATCH",
        headers: { contentType: "application/json" },
        body: { title },
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.playlists() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.playlist(data.playlistId),
      });
      toast.success(data.message || "Playlist updated successfully.");
    },
    onError: (e) => {
      console.error("Failed to update playlist", e);
      toast.error(e.message || "Failed to update playlist");
    },
  });
}

export function useDeletePlaylist() {
  const client = useClient<{ message: string; playlistId: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: "/p/$playlistId" });
  const pathname = useLocation({ select: (location) => location.pathname });

  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      client(`${BASE_URL}/api/playlists/${id}`, {
        method: "DELETE",
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.playlists() });
      toast.success(data.message || "Playlist deleted successfully.");

      if (`/p/${data.playlistId}` === pathname) {
        navigate({ to: "/", search: { q: "" } });
      }
    },
    onError: (e) => {
      console.error("Failed to delete playlist", e);
      toast.error(e.message || "Failed to delete playlist");
    },
  });
}

export function useAddTrackToPlaylist() {
  const queryClient = useQueryClient();
  const client = useClient<{ message: string; playlistId: string }>();

  return useMutation({
    mutationFn: ({
      playlistId,
      trackId,
    }: {
      playlistId: string;
      trackId: string;
    }) =>
      client(`${BASE_URL}/api/playlists/${playlistId}/tracks/${trackId}`, {
        method: "POST",
        headers: {
          contentType: "application/json",
        },
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.playlist(data.playlistId),
      });
      toast.success(data.message || "Track added to playlist successfully.");
    },
    onError: (e) => {
      console.error("Failed to add track to playlist", e);
      toast.error(e.message || "Failed to add track to playlist");
    },
  });
}

export function useRemoveTrackFromPlaylist() {
  const queryClient = useQueryClient();
  const client = useClient<{ message: string; playlistId: string }>();

  return useMutation({
    mutationFn: ({
      trackId,
      playlistId,
    }: {
      trackId: string;
      playlistId: string;
    }) =>
      client(`${BASE_URL}/api/playlists/${playlistId}/tracks/${trackId}`, {
        method: "DELETE",
        headers: {
          contentType: "application/json",
        },
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.playlist(data.playlistId),
      });
      toast.success(
        data.message || "Track removed from playlist successfully.",
      );
    },
    onError: (e) => {
      console.error("Failed to remove track from playlist", e);
      toast.error(e.message || "Failed to remove track from playlist");
    },
  });
}

export function useUploadPlaylistCover() {
  const queryClient = useQueryClient();
  const client = useClient<{ message: string; playlistId: string }>();

  return useMutation({
    mutationFn: async ({
      playlistId,
      image,
    }: {
      playlistId: string;
      image: File;
    }) => {
      const formData = new FormData();
      formData.append("image", image);

      return await client(
        `${BASE_URL}/api/playlists/${playlistId}/upload/image`,
        {
          method: "POST",
          headers: {
            contentType: undefined,
          },
          body: formData,
        },
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.playlist(data.playlistId),
      });
      toast.success(data.message || "Playlist cover uploaded successfully.");
    },
    onError: (e) => {
      console.error("Failed to upload playlist cover", e);
      toast.error(e.message || "Failed to upload playlist cover");
    },
  });
}

export function useAddTrackToFavorites() {
  const queryClient = useQueryClient();
  const client = useClient<{ message: string; playlistId: string }>();

  return useMutation({
    mutationFn: ({ trackId }: { trackId: string }) =>
      client(`${BASE_URL}/api/playlists/favorites/tracks/${trackId}`, {
        method: "POST",
        headers: {
          contentType: "application/json",
        },
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tracks() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.playlist(data.playlistId),
      });
      toast.success(data.message || "Track added to favorites successfully.");
    },
    onError: (e) => {
      console.error("Failed to add track to favorites", e);
      toast.error(e.message || "Failed to add track to favorites");
    },
  });
}

export function useRemoveTrackFromFavorites() {
  const queryClient = useQueryClient();
  const client = useClient<{ message: string; playlistId: string }>();

  return useMutation({
    mutationFn: ({ trackId }: { trackId: string }) =>
      client(`${BASE_URL}/api/playlists/favorites/tracks/${trackId}`, {
        method: "DELETE",
        headers: {
          contentType: "application/json",
        },
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tracks() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.playlist(data.playlistId),
      });
      toast.success(
        data.message || "Track removed from favorites successfully.",
      );
    },
    onError: (e) => {
      console.error("Failed to remove track from favorites", e);
      toast.error(e.message || "Failed to remove track from favorites");
    },
  });
}
