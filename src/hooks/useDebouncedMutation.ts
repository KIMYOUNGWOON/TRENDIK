import { useMutation } from "@tanstack/react-query";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef } from "react";

export function useDebouncedMutation(
  mutationFn: (value: string) => Promise<void>,
  options = {}
) {
  const mutation = useMutation({
    mutationFn,
    ...options,
  });

  const debouncedMutationFn = useRef(
    debounce((variables) => {
      mutation.mutate(variables);
    }, 400)
  );

  useEffect(() => {
    const debouncedFn = debouncedMutationFn.current;

    return () => {
      debouncedFn.cancel();
    };
  }, []);

  const debouncedMutate = useCallback((variables: string) => {
    debouncedMutationFn.current(variables);
  }, []);

  return { ...mutation, mutate: debouncedMutate };
}
