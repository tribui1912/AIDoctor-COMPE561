
export default function LocationPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-bold mb-6">Our Locations</h1>
      <p>Visit us at any of our 3 locations below.</p>

      <section className="space-y-4"> 
      <h2 className="text-2xl font-semibold mb-4"> Our Main Branch - San Diego </h2>
        <p>123 Hospital Street, San Diego, California 92182 </p>

          <iframe
            src="https://www.google.com/maps/embed/v1/place?q=San+diego+state+university&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full rounded-lg shadow-md"
          />
     </section>
     
      <section className="space-y-4"> 
      <h2 className="text-2xl font-semibold mb-4"> Our Second Branch - New York</h2>
        <p>123 Hospital Street, New York City, New York 10001 </p>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2176767606297!2d-73.98823492426385!3d40.748440537541225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1682805705560!5m2!1sen!2sus"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full rounded-lg shadow-md"
          />
     </section>

     <section className="space-y-4"> 
      <h2 className="text-2xl font-semibold mb-4"> Our Third Branch - Washington DC </h2>
        <p>123 Hospital Street, Washington, DC 20500 </p>

          <iframe
            src="https://www.google.com/maps/embed/v1/place?q=white+house&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full rounded-lg shadow-md"
          />
     </section>
    </div>
  );
}
