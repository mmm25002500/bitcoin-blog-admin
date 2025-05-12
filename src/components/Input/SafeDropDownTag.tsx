// components/Input/SafeDropDownTag.tsx
'use client';
import dynamic from 'next/dynamic';

const SafeDropDownTag = dynamic(() => import('./DropDownTag'), {
  ssr: false,
});

export default SafeDropDownTag;
