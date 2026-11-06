// One source for the data-handling statement so the form and footer never disagree.
export default function PrivacyNote({ className = "" }) {
    return (
        <p className={`text-xs leading-relaxed text-muted ${className}`}>
            AI feedback can be wrong, so treat it as a starting point. Your resume is sent to Google Gemini for analysis and
            isn&rsquo;t saved by this app. On Gemini&rsquo;s free tier Google may use submitted content to improve its
            services, so leave out ID numbers and other sensitive details.
        </p>
    );
}
