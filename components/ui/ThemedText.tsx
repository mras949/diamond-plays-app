import { Text, type TextProps } from 'react-native';

import { cn } from '@/lib/utils';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
  className?: string;
};

export function ThemedText({
  style,
  type = 'default',
  className,
  ...rest
}: ThemedTextProps) {
  return (
    <Text
      className={cn(
        className,
        type === 'default' && 'text-base text-text',
        type === 'title' && 'text-3xl font-bold text-text',
        type === 'defaultSemiBold' && 'text-base font-semibold text-text',
        type === 'subtitle' && 'text-lg font-bold text-text',
        type === 'link' && 'text-base text-primary'
      )}
      style={style}
      {...rest}
    />
  );
}
