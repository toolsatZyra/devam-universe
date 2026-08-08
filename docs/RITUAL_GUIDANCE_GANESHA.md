# Ganesh Chaturthi household guidance

## Implemented boundary

The MVP contains one complete-in-scope, internal-beta household procedure for
the supported West India Ganesh Chaturthi context. It is available in English
and Hindi and is returned only when the request supplies that supported context.
Other regions and traditions remain explicit fallbacks rather than silently
receiving this procedure as universal practice.

The frozen research pack is
`knowledge_packs/rituals/ganesh-chaturthi-west-india-v1.json`:

- bytes: `29,969`
- SHA-256: `2c90bfba1e8eda5539186c96baca7027db3af7dd6ce6a293b3c86a9e7e47fa34`
- contract: `DEVAM_RITUAL_PROCEDURE_PACK_V1`

The server rehashes and validates the pack before use. It rejects schema drift,
source-reference drift, missing tier order, duplicate step ordinals, and steps
whose evidence identifiers are absent from the pack.

## What the guide provides

- minimum, standard, and elaborate household forms;
- materials with practical substitutions;
- concise steps with an optional explanation of why each step is present;
- questions about family practice and sampradaya when those are known;
- separate handling for a permanent home image and a temporary festival murti;
- daily care during a multi-day observance;
- bounded uttarpuja and responsible visarjan guidance; and
- the retained exact-source four-step Ganesha hymn reading as an optional
  companion rather than a substitute for the procedure.

## Evidence and rights boundary

The synthesis binds five typed sources: Maharashtra Tourism festival context,
Shree Siddhivinayak Ganapati Temple Trust puja categories, one explicitly
labelled living-tradition household procedure, fixed historical
Nirnayasindhu evidence, and Devam's retained derivative-allowed Ganesha hymn
pack. The API returns source identity and attribution without copying source
passages into the response.

The living-tradition procedure is evidence for one practice lane, not authority
for every family, region, or sampradaya. Historical prescriptions are not
silently converted into present-day norms.

## Claims deliberately left open

This pack does not claim:

- a universal Ganesh Puja vidhi;
- complete practice coverage for Maharashtra, Goa, Karnataka,
  Andhra-Telangana, Tamil Nadu, or other regions;
- the complete day-by-day Ganeshotsav sequence;
- formal priest-led mantra and consecration instructions;
- that historical practice is mandatory modern practice; or
- completeness of Devam's broader Ganesha library.
