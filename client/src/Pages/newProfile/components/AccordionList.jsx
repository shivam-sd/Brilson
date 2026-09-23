import { memo } from "react";
import { ACCORDION_SECTIONS } from "../data/profileConfig";
import Accordion from "./Accordion";
import { SECTION_COMPONENTS } from "./sections";

function AccordionList({ code, profile, availability }) {
  const visibleSections = ACCORDION_SECTIONS.filter(
    ({ id }) => availability?.[id]
  );

  return (
    <div className="flex flex-col gap-3 sm:gap-3.5">
      {visibleSections.map(({ id, title, subtitle, icon, color }) => {
        const Section = SECTION_COMPONENTS[id];
        return (
          <Accordion key={id} icon={icon} title={title} subtitle={subtitle} color={color}>
            <Section code={code} profile={profile} />
          </Accordion>
        );
      })}
    </div>
  );
}

export default memo(AccordionList);
