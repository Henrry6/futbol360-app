import { Card, Divider } from "antd";

interface ResponsiveCardProps {
  header: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export default function ResponsiveCard({
  header,
  children,
  footer,
  className,
}: ResponsiveCardProps) {
  return (
    <Card className={`rounded-xl shadow-sm overflow-hidden ${className ?? ""}`}>
      <div className="p-4 bg-linear-to-r from-green-200 to-indigo-300">
        <div className="flex max-[500px]:flex-col gap-3 flex-row justify-between items-start ">
          {header}
        </div>
      </div>

      <div className="p-4">{children}</div>

      {footer && (
        <>
          <Divider className="my-0" />
          <div className="flex justify-center items-center">{footer}</div>
        </>
      )}
    </Card>
  );
}
