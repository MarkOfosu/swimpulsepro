import React from 'react';

interface SectionHeaderProps {
  heading: string;
  TagName?: React.ElementType;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ heading, TagName = 'h2' }) => {
  const id = heading.toLowerCase()
    .replace(/&[^\s;]+;?/g, '')
    .replace(/[^\s\w-]+/g, '')
    .replace(/\s+/g, '-');

  return (
    <TagName id={id} className="content-subhead">
      {heading}
      <a href={`#${id}`} className="content-link" title="Heading anchor"></a>
    </TagName>
  );
}

export default SectionHeader;
