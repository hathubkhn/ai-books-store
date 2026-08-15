export default function LearningJourney() {
  const stages = [
    {
      number: "01",
      title: "Introduction",
      subtitle: "Primary School",
      description: "First steps into the world of AI through stories and activities",
    },
    {
      number: "02",
      title: "Exploration",
      subtitle: "Middle School",
      description: "Discover how AI works in everyday life and technology",
    },
    {
      number: "03",
      title: "Build Foundations",
      subtitle: "High School",
      description: "Learn mathematics, programming, and ML fundamentals",
    },
    {
      number: "04",
      title: "Study in Depth",
      subtitle: "University",
      description: "Master AI, Machine Learning, and Deep Learning",
    },
    {
      number: "05",
      title: "Specialization",
      subtitle: "Advanced",
      description: "Computer Vision, Algorithms, and cutting-edge AI systems",
    },
  ];

  return (
    <section className="section-padding bg-surface">
      <div className="container-custom">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
            A Journey Through AI
          </h2>
          <p className="text-foreground-secondary max-w-2xl mx-auto">
            These are not isolated books. They form a continuous learning ecosystem from primary school to advanced specialization.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {stages.map((stage, index) => (
            <div key={stage.number}>
              <div className="flex gap-8 items-start">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-accent-soft flex items-center justify-center">
                    <span className="font-serif text-xl font-semibold text-accent">
                      {stage.number}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1 pb-12">
                  <h3 className="font-serif text-2xl font-semibold mb-1">
                    {stage.title}
                  </h3>
                  <div className="text-accent font-medium mb-2">
                    {stage.subtitle}
                  </div>
                  <p className="text-foreground-secondary">
                    {stage.description}
                  </p>
                </div>
              </div>
              
              {index < stages.length - 1 && (
                <div className="flex gap-8 items-start -mt-6 mb-6">
                  <div className="flex-shrink-0 w-16 flex justify-center">
                    <div className="w-0.5 h-12 bg-border" />
                  </div>
                  <div className="flex-1" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
