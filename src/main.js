import { animate } from 'motion'

document.addEventListener('DOMContentLoaded', () => {
  // Select all dropdown triggers
  const dropdownTriggers = document.querySelectorAll(
    '.nav_links_link.is-dropdown'
  )
  const mobileMenuTrigger = document.getElementById('mobile-menu-btn')
  const mobileMenuCloseTrigger = document.getElementById('mobile-menu-close')
  const mobileMenu = document.getElementById('mobile-menu')

  // Attach event listeners to each dropdown trigger
  dropdownTriggers.forEach((dropdownTrigger) => {
    const dropdownMenu = dropdownTrigger.nextElementSibling // Assuming the menu is the next sibling
    let isOpen = false

    dropdownTrigger.addEventListener('click', (event) => {
      event.preventDefault() // Prevent any default link behavior

      // Close all other open dropdowns
      dropdownTriggers.forEach((otherTrigger) => {
        if (
          otherTrigger !== dropdownTrigger &&
          otherTrigger.classList.contains('open')
        ) {
          const otherMenu = otherTrigger.nextElementSibling
          closeDropdown(otherMenu, otherTrigger)
        }
      })

      // Toggle the current dropdown
      if (dropdownTrigger.classList.contains('open')) {
        closeDropdown(dropdownMenu, dropdownTrigger)
        isOpen = false
      } else {
        dropdownMenu.style.display = 'flex'
        animate(
          dropdownMenu,
          {
            opacity: 1,
            scale: [0.6, 1],
          },
          {
            ease: [0.165, 0.84, 0.44, 1],
            duration: 0.25,
          }
        )
        dropdownTrigger.classList.add('open')
        isOpen = true
      }
    })
  })

  // Close dropdowns on outside click
  document.addEventListener('click', (event) => {
    dropdownTriggers.forEach((dropdownTrigger) => {
      const dropdownMenu = dropdownTrigger.nextElementSibling
      if (
        dropdownTrigger.classList.contains('open') &&
        !dropdownTrigger.contains(event.target) &&
        !dropdownMenu.contains(event.target)
      ) {
        closeDropdown(dropdownMenu, dropdownTrigger)
      }
    })
  })

  // Open mobile menu
  mobileMenuTrigger.addEventListener('click', (event) => {
    event.preventDefault()

    // First, manually set the starting position
    mobileMenu.style.transform = 'translateY(-100%)'
    mobileMenu.style.display = 'flex'

    // Critical: Force browser to apply the above styles before animating
    window.getComputedStyle(mobileMenu).transform

    // Now animate with a slight delay
    setTimeout(() => {
      mobileMenu.style.transition =
        'transform 0.7s cubic-bezier(0.32, 0.72, 0, 1)'
      mobileMenu.style.transform = 'translateY(0%)'
    }, 10)
  })

  // Close mobile menu
  mobileMenuCloseTrigger.addEventListener('click', (event) => {
    event.preventDefault()

    mobileMenu.style.transition =
      'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)'
    mobileMenu.style.transform = 'translateY(-100%)'

    // Hide after animation completes
    setTimeout(() => {
      mobileMenu.style.display = 'none'
    }, 300) // Match this with your animation duration
  })

  const closeDropdown = (dropdownMenu, dropdownTrigger) => {
    animate(
      dropdownMenu,
      {
        opacity: 0,
        scale: 0.6,
      },
      {
        duration: 0.2,
        easing: [0.55, 0.085, 0.68, 0.53],
        onComplete: () => {
          dropdownMenu.style.display = 'none'
          dropdownTrigger.classList.remove('open') // Remove "open" class
        },
      }
    )
  }
})
