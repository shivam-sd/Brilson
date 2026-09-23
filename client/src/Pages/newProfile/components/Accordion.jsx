import { memo, useId, useState } from "react";
import { LuChevronDown } from "react-icons/lu";
import { SECTION_THEMES } from "../data/profileConfig";
import { cn } from "../utils/helpers";

function Accordion({ icon: Icon, title, subtitle, color = "orange", defaultOpen = false, onToggle, children }) {
  const theme = SECTION_THEMES[color];
  const uid = useId();
  const buttonId = `${uid}-button`;
  const panelId = `${uid}-panel`;

  const [open, setOpen] = useState(defaultOpen);
  const [hasOpened, setHasOpened] = useState(defaultOpen);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) setHasOpened(true);
    onToggle?.(next);
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border bg-gradient-to-br from-[#0d141c] via-[#0a1017] to-[#070b10]",
        "shadow-[0_12px_32px_-16px_rgba(0,0,0,0.9)] transition-[border-color,box-shadow] duration-300 motion-reduce:transition-none",
        open ? cn(theme.openBorder, "shadow-[0_16px_40px_-18px_rgba(0,0,0,1)]") : "border-white/10 hover:border-white/20"
      )}
    >
      <h3 className="m-0">
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={toggle}
          className={cn(
            "cursor-pointer flex w-full items-center gap-4 p-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset sm:p-4",
            theme.focus
          )}
        >
          <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl sm:h-[62px] sm:w-[62px]", theme.iconBox)}>
            <Icon className={cn("h-6 w-6 sm:h-7 sm:w-7", theme.icon)} aria-hidden="true" />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block text-base font-semibold leading-tight text-white sm:text-[17px]">{title}</span>
            <span className="mt-1 block text-[13px] leading-snug text-slate-400 sm:text-sm">{subtitle}</span>
          </span>

          <LuChevronDown
            className={cn(
              "cursor-pointer h-5 w-5 shrink-0 text-slate-200 transition-transform duration-300 motion-reduce:transition-none",
              open && "rotate-180"
            )}
            aria-hidden="true"
          />
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={cn(
          "grid transition-[grid-template-rows,visibility] duration-300 ease-out motion-reduce:transition-none",
          open ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="mx-3.5 border-t border-white/[0.07] pb-5 pt-4 sm:mx-4">{hasOpened ? children : null}</div>
        </div>
      </div>
    </div>
  );
}

export default memo(Accordion);
