import Edges from "../edges";

export interface TextareaProps {
  text: string;
}

export function Textarea({ text }: TextareaProps) {
  return (
    <Edges className="my-10 prose" dangerouslySetInnerHTML={{ __html: text }} />
  );
}
