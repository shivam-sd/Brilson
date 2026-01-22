const SocialButton = ({ icon, label, url, gradient }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        group flex items-center justify-center gap-3
        px-4 py-2 rounded-xl
        bg-gradient-to-r ${gradient}
        text-white text-sm font-medium
        shadow-lg hover:shadow-xl
        transition-all duration-300
        hover:scale-[1.03]
      `}
    >
      <span className="text-lg">{icon}</span>

      {/* Desktop label only */}
      <span className="hidden lg:block tracking-wide">
        {label}
      </span>
    </a>
  );
};


export default SocialButton;