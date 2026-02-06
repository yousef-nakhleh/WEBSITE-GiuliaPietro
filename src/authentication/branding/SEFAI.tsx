import Info from "./Info";

export default function SEFAI({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center auth-text-primary ${className}`}>
      <span className="text-xs font-booking inline-flex items-center gap-1">
        <span className="italic">Salone partner di</span>
        <span className="inline-flex items-center gap-0.5">
          <a
            href="https://sef-ai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:brightness-110 transition-colors duration-200"
          >
            SEF AI
          </a>
          <Info />
        </span>
      </span>
    </div>
  );
}
