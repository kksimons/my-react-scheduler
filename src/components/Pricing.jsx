
import React from 'react';

const Pricing = () => {
  return (

    // Pricing & Plans Whole Container
    <section className="pricing-section"> 

      {/* Container: header, title, sub, pricing, map   */}
      <div className="pricing-container">

        {/* Container for header and sub */}
        <div className="pricing-header-container">
          <h2 className="pricing-title">Maximize Your Experience with Our Plans</h2>
          <p className="pricing-subtitle">Pricing & Plan</p>
        </div>

        <div className='pricing-text-container'>
            <p className="pricing-primary-text"></p>
        </div>

        {/* Container for all grid */}
        <div className="pricing-grid">
          {[
            {
              name: 'Free',
              price: '$0',
              duration: 'Per month',
              features: ['01 Website', '100 GB Storage', 'No Database'],
            },
            {
              name: 'Team',
              price: '$99',
              duration: 'Per month',
              features: ['10 Websites', '500 GB Storage', '15 Databases'],
            },
            {
              name: 'Popular',
              price: '$150',
              duration: 'Per month',
              features: ['50 Websites', '1 TB Storage', 'Unlimited Databases'],
              popular: true,
            },
            {
              name: 'Enterprise',
              price: '$490',
              duration: 'Per month',
              features: ['Unlimited Websites', 'Unlimited Storage', 'Unlimited Databases'],
            },
          ].map((plan, index) => (
            <div
              key={index}
              className={`plan-card ${plan.popular ? 'popular' : ''}`}
            >
              <h3 className="plan-name">{plan.name}</h3>
              <p className="plan-price">{plan.price}</p>
              <p className="plan-duration">{plan.duration}</p>
              <ul className="plan-features">
                {plan.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
              <button className="plan-button">
                Get Started
              </button>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
};

export default Pricing;
