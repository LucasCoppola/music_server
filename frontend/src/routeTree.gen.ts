/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as PlaylistPlaylistIdImport } from './routes/playlist.$playlistId'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const PlaylistPlaylistIdRoute = PlaylistPlaylistIdImport.update({
  path: '/playlist/$playlistId',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/playlist/$playlistId': {
      id: '/playlist/$playlistId'
      path: '/playlist/$playlistId'
      fullPath: '/playlist/$playlistId'
      preLoaderRoute: typeof PlaylistPlaylistIdImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/playlist/$playlistId': typeof PlaylistPlaylistIdRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/playlist/$playlistId': typeof PlaylistPlaylistIdRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/playlist/$playlistId': typeof PlaylistPlaylistIdRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/playlist/$playlistId'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/playlist/$playlistId'
  id: '__root__' | '/' | '/playlist/$playlistId'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  PlaylistPlaylistIdRoute: typeof PlaylistPlaylistIdRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  PlaylistPlaylistIdRoute: PlaylistPlaylistIdRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/playlist/$playlistId"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/playlist/$playlistId": {
      "filePath": "playlist.$playlistId.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
