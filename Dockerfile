FROM qcifengineering/redbox-portal
RUN cd /opt/redbox-portal && yarn add @researchdatabox/sails-hook-redbox-pdfgen
