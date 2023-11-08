type Book = {
  id: string;
  firstPreviewImage: {watermarked: string};
  title: string;
  author: {
    details: {
      publicName: string;
    };
  };
  price: string;
};

type FormattedSegments = {
  text: string;
  style: StyleProp<TextStyle>;
};

interface SearchIconProps {
  size?: number;
  color?: string;
}
