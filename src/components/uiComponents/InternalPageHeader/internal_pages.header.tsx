import { Container } from '@/app/[restaurants]/(pages)/informacao/informacao.style';
import { useRouter } from 'next/navigation';
import React from 'react';
import { IconArrowBack } from 'takeat-design-system-ui-kit';
import { TakeatHeaderInternalPage, TakeatInternalContainer } from './internal_pages.style';

export default function InternalPages(
  { children, title, description, button }: Readonly<{ children?: React.ReactNode, title?: string, description?: string, button?: boolean }>) {
  const { back } = useRouter();

  return (
    <TakeatInternalContainer>
      <TakeatHeaderInternalPage>
        {button && (
          <button type="button" onClick={() => back()}>
            <IconArrowBack style={{ fill: '#c8131b', fontSize: 28 }} />
          </button>
        )}
        <h2 className="font-semibold text-xl text-takeat-neutral-darker">{title}</h2>
      </TakeatHeaderInternalPage>

      {description && (<Container><span>{description}</span></Container>)}

      {children}

    </TakeatInternalContainer>
  )
}