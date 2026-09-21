import { act, renderHook } from "@testing-library/react";
import { usePagination } from "@/hooks/use-pagination";

describe("usePagination", () => {
  const items = Array.from({ length: 10 }, (_, i) => i + 1);

  it("démarre sur la première page", () => {
    const { result } = renderHook(() => usePagination(items, 4));

    expect(result.current.items).toEqual([1, 2, 3, 4]);
  });

  it("change de page", () => {
    const { result } = renderHook(() => usePagination(items, 4));

    act(() => result.current.setPage(2));

    expect(result.current.items).toEqual([5, 6, 7, 8]);
  });

  it("ramène la page dans les limites quand la liste rétrécit", () => {
    const { result, rerender } = renderHook(({ list }) => usePagination(list, 4), {
      initialProps: { list: items },
    });
    act(() => result.current.setPage(3));

    rerender({ list: [1, 2] });

    expect(result.current.page).toBe(1);
  });
});
