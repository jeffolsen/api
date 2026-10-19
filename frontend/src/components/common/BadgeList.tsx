import clsx from "clsx";

type TBadge = {
  text: string;
  key: string | number;
};

function BadgeList({
  badges,
  className = "",
  ...props
}: {
  badges: TBadge[];
  className?: string;
}) {
  return (
    <div {...props} className={clsx("flex gap-3 flex-wrap", className)}>
      {badges.map((badge: TBadge) => (
        <Badge key={badge.key} text={badge.text} />
      ))}
    </div>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <div className="badge badge-secondary badge-lg text-secondary-content">
      {text}
    </div>
  );
}

export default BadgeList;
