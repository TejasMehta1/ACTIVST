const causesAutofill = () => {
    return [
        {
            title: "Black Lives Matter",
            image: "https://images-na.ssl-images-amazon.com/images/I/71FZk1ZBf2L._AC_SL1500_.jpg",
            description: "Black Lives Matter (BLM) is a decentralized political and social movement protesting against incidents of police brutality and all racially motivated violence against black people." +
                "\n" +
                "We appreciate your support of the movement and our ongoing fight to end state-sanctioned violence, liberate Black people, and end white supremacy forever." +
                "\n" +
                "You can make a difference by protesting, educating, listening, consciously shopping, and donating",
            donations: {
                website: true,
                direct: true,
                petition: true,
            },
            donationData: {
                website: "https://blacklivesmatter.com/",
                direct: "https://secure.actblue.com/donate/ms_blm_homepage_2019",
                petition: "https://www.naacp.org/campaigns/we-are-done-dying/",
            }

        },
        {
            title: "Stop AAPI Hate",
            image: "https://secureservercdn.net/104.238.69.231/a1w.90d.myftpupload.com/wp-content/themes/stopaapihate/assets/image/logos/stopaapihate-logo.png",
            description: "Our communities stand united against racism. Hate against Asian American Pacific Islander communities has risen during the COVID-19 pandemic. Together, we can stop it." +
                "\n" +
                "1\n" +
                "Take Action: Approach the targeted person, introduce yourself, and offer support.\n" +
                "2\n" +
                "Actively Listen: Ask before taking any actions and respect the targeted person’’s wishes. Monitor the situation if needed.\n" +
                "3\n" +
                "Ignore Attacker: Using your discretion, attempt to calm the situation by using your voice, body language, or distractions.\n" +
                "4\n" +
                "Accompany: If the situation escalates, invite the targeted person to join you in leaving.\n" +
                "5\n" +
                "Offer Emotional Support: Help the targeted person by asking how they’re feeling. Assist them in figuring out what they want to do next.",
            website: "https://stopaapihate.org/",
            direct: "https://donate.givedirect.org/?cid=14711",
            petition: "https://www.change.org/t/asian-americans-en-us",
        }
    ];
};
export default causesAutofill;
