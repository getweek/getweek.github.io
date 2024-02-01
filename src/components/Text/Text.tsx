import React, { forwardRef, AnchorHTMLAttributes, ReactNode, HTMLAttributes } from 'react';
import styled from 'styled-components';

type CommonProps = {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  muted?: boolean;
  bold?: boolean;
  interactive?: boolean;
  inherit?: boolean;
  link?: boolean;
  children: ReactNode;
};

type SpanProps = {
  as?: 'span';
} & CommonProps & HTMLAttributes<HTMLSpanElement>

type AnchorProps = {
  as?: 'a';
} & CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>

export const Text = forwardRef<HTMLElement, SpanProps | AnchorProps>((props, ref: React.Ref<HTMLElement>) => {
  const {
    children,
    as = 'span',
    ...rest
  } = props;

  return (
    <Root as={as} {...rest} ref={ref}>{children}</Root>
  )
});

const Root = styled.span<CommonProps>`
  font-family: 'Open Sans', sans-serif;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
  min-height: 18px;
  font-weight: ${p => p.bold ? 600 : 'normal'};
  font-size: ${p => {
    switch (p.size) {
      case 'xs':
        return '10px';
      case 'sm':
        return '12px';
      case 'lg':
        return '15px';
      case 'md':
      default:
        return '13px';
    }
  }};
  color: ${p => {
    // p.muted ? p.theme.mutedColor : p.inherit ? 'inherit' : p.theme.textColor
    if (p.muted) {
      return p.theme.mutedColor;
    }
    if (p.inherit) {
      return 'inherit';
    }
    if (p.link) {
      return p.theme.primaryColor;
    }

    return p.theme.textColor;
  }};
  cursor: ${p => p.interactive ? 'pointer' : 'inherit'};
`;
