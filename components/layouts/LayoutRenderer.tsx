
import React from 'react';
import type { Section, ColorScheme, GoogleFont, CustomColors } from '../../types';
import { Layout1, Layout2, Layout3, Layout4, Layout5 } from './Layouts';

interface LayoutRendererProps {
  layoutId: number;
  sections: Section[];
  generatedImages: string[];
  colorScheme: ColorScheme;
  font: GoogleFont;
  customColors: CustomColors;
  sectionWrapper: (index: number, children: React.ReactNode) => React.ReactNode;
  onImageClick: (src: string, index: number) => void;
  onSectionUpdate: (id: string, content: Partial<Section['content']>) => void;
}

export const LayoutRenderer: React.FC<LayoutRendererProps> = ({ layoutId, ...props }) => {
  const renderSections = (LayoutComponent: React.FC<any>) => (
    <LayoutComponent {...props} />
  );

  switch (layoutId) {
    case 1:
      return renderSections(Layout1);
    case 2:
      return renderSections(Layout2);
    case 3:
      return renderSections(Layout3);
    case 4:
      return renderSections(Layout4);
    case 5:
      return renderSections(Layout5);
    default:
      return renderSections(Layout1);
  }
};
