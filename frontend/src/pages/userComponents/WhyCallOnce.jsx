
const WhyCallOnce = () => {
  const features = [
    {
      icon: "/Customer.png",
      title: '24x7',
      subtitle: 'Customer Service',
      description: 'Our Company Provides High Qualified Professional Workers'
    },
    {
      icon: "/Secure.png",
      title: '24x7',
      subtitle: 'Customer Service',
      description: 'Our robust Security System ensures your data is always protected, providing confidentiality for business operation.'
    },
    {
      icon: "/247.png",
      title: '24x7',
      subtitle: 'Customer Service',
      description: 'Our dedicated Support team is available for 24/7 for any query and issues.'
    }
  ];

  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Why CallOnce</h2>
          <p className="text-lg sm:text-xl text-black max-w-3xl mx-auto">
            Don&apos;t waste time on search manual tasks. Let Automation do it for you. Simplify workflows, reduce errors, and save time.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-5 sm:gap-8 lg:gap-12 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-4">
                <img
                  src={feature.icon}
                  alt={`${feature.title} icon`}
                  className="w-20 h-20 sm:w-40 sm:h-40 lg:w-[200px] lg:h-[200px] p-2 sm:p-4 lg:p-5 overflow-visible rounded-full border-2 sm:border-4 border-black shadow-md"
                />
              </div>
              <div>
                <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold mb-1">{feature.title}</h3>
                <h4 className="text-lg sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3">{feature.subtitle}</h4>
                <p className="text-gray-600 leading-tight font-semibold hidden lg:block">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyCallOnce;

