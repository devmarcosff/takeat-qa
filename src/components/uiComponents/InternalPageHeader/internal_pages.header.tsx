import { Container } from '@/app/[restaurants]/(pages)/informacao/informacao.style';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';
import { IconArrowBack } from 'takeat-design-system-ui-kit';
import { TakeatHeaderInternalPage, TakeatInternalContainer } from './internal_pages.style';

export default function InternalPages(
  { children, title, description, button, help, restaurant, backPage }: Readonly<{ children?: React.ReactNode, title?: string, description?: string, button?: boolean, help?: boolean, restaurant?: string, backPage?: boolean }>) {
  const { back, push } = useRouter();

  return (
    <TakeatInternalContainer>
      <TakeatHeaderInternalPage className={`${!!help && 'flex justify-between'}`}>
        {button && (
          <button type="button" onClick={() => backPage ? push(`/${restaurant}/pedidos`) : back()}>
            <IconArrowBack style={{ fill: '#c8131b', fontSize: 28 }} />
          </button>
        )}
        <h2 className="font-semibold text-xl text-takeat-neutral-darker">{title}</h2>
        {
          !!help && (
            <Button type="button" variant={'default'} className='py-2 !px-5 h-full rounded-lg' onClick={() => alert("Ajuda")}>
              <span>Ajuda</span>
            </Button>
          )
        }
      </TakeatHeaderInternalPage>

      {description && (<Container><span>{description}</span></Container>)}

      {children}

    </TakeatInternalContainer>
  )
}