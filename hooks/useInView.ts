import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, LayoutChangeEvent } from 'react-native';
import {
  Easing,
  SharedValue,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

const WH = Dimensions.get('window').height;

export function useInView(
  scrollOffset: SharedValue<number> | null | undefined,
  threshold = 80
) {
  const sectionY = useSharedValue(-1);
  const firedSV = useSharedValue(false);
  const [triggered, setTriggered] = useState(false);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    sectionY.value = e.nativeEvent.layout.y;
  }, []);

  useAnimatedReaction(
    () => scrollOffset?.value ?? 0,
    (scroll) => {
      'worklet';
      if (firedSV.value || sectionY.value < 0) return;
      if (scroll + WH > sectionY.value + threshold) {
        firedSV.value = true;
        runOnJS(setTriggered)(true);
      }
    }
  );

  return { onLayout, triggered };
}

export interface EnterOptions {
  fromY?: number;
  fromX?: number;
  fromScale?: number;
  duration?: number;
}

export function useEnterAnim(triggered: boolean, delay = 0, opts: EnterOptions = {}) {
  const optsRef = useRef(opts);
  optsRef.current = opts;
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!triggered) return;
    const { duration = 600 } = optsRef.current;
    progress.value = withDelay(
      delay,
      withTiming(1, { duration, easing: Easing.out(Easing.cubic) })
    );
  }, [triggered]);

  return useAnimatedStyle(() => {
    const { fromY = 40, fromX = 0, fromScale = 1 } = optsRef.current;
    return {
      opacity: progress.value,
      transform: [
        { translateY: interpolate(progress.value, [0, 1], [fromY, 0]) },
        { translateX: interpolate(progress.value, [0, 1], [fromX, 0]) },
        { scale: interpolate(progress.value, [0, 1], [fromScale, 1]) },
      ],
    };
  });
}
