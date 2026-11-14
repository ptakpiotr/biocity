import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AppIcon } from "@/components/AppIcon";
import { useProgress } from "@/store/progressStore";
import type { TeamIcon } from "@/Types";

const ICONS: TeamIcon[] = ["rocket", "cat", "flame", "turtle"];

export const TeamSetup = ({ onDone }: { onDone: () => void }) => {
  const { t } = useTranslation();
  const team = useProgress((state) => state.team);
  const setTeam = useProgress((state) => state.setTeam);
  const [name, setName] = useState(team?.name ?? "");
  const [icon, setIcon] = useState<TeamIcon>(team?.icon ?? "rocket");
  return (
    <section className="team-setup" aria-labelledby="team-heading">
      <div className={`team-preview team-color-${icon}`} aria-hidden="true">
        <AppIcon name={icon} />
      </div>
      <h1 id="team-heading">{t(team ? "team.editTitle" : "team.title")}</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!name.trim()) return;
          setTeam({ name: name.trim(), icon });
          onDone();
        }}
      >
        <label className="team-name-label" htmlFor="team-name">
          {t("team.name")}
        </label>
        <input
          id="team-name"
          name="teamName"
          autoFocus
          required
          maxLength={32}
          autoComplete="off"
          placeholder={t("team.placeholder")}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <fieldset className="team-icons">
          <legend>{t("team.chooseIcon")}</legend>
          {ICONS.map((value) => (
            <label key={value} className={`team-icon-choice team-color-${value}`}>
              <input
                type="radio"
                name="teamIcon"
                value={value}
                checked={value === icon}
                onChange={() => setIcon(value)}
              />
              <span>
                <AppIcon name={value} />
                <small>{t(`team.icons.${value}`)}</small>
              </span>
            </label>
          ))}
        </fieldset>
        <button type="submit" className="primary team-start" disabled={!name.trim()}>
          {t(team ? "team.save" : "team.start")}
        </button>
        {team && (
          <button type="button" className="team-cancel" onClick={onDone}>
            {t("team.cancel")}
          </button>
        )}
      </form>
    </section>
  );
};
