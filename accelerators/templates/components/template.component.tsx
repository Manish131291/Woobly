import './ComponentFile.style.scss';

interface ComponentFileProps {
  // add props here....
  prop: any;
}

export const ComponentFile = ({ ...props }: ComponentFileProps) => {
  return <div>ComponentFile - Create component here</div>;
};
