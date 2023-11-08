export const formatText = (input: string) => {
  const segments = input.split(/(<em>.*?<\/em>)/);

  const formattedSegments: FormattedSegments[] = segments.map(segment => {
    if (segment.startsWith('<em>')) {
      // Render text within <em> tags without <em> tags
      const innerText = segment.replace(/<\/?em>/g, '');
      return {
        text: innerText,
        style: {fontWeight: 'bold'},
      };
    } else {
      // Render plain text
      return {
        text: segment,
        style: {},
      };
    }
  });

  return formattedSegments;
};
