import { useAsyncResource } from '@/hooks/useAsyncResource'
import { useApi } from '@/services/api/useApi'

export const CATALOGUE_PAGE_SIZE = 5

export function useUniversityCatalogue(search: string, page: number) {
  const api = useApi()
  return useAsyncResource(
    (signal) =>
      api.universities.list(
        { search: search || undefined, page, pageSize: CATALOGUE_PAGE_SIZE },
        { signal },
      ),
    [api.mode, search, page],
  )
}
